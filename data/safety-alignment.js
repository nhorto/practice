const safetyAlignment = [
  // ── Coding ──────────────────────────────────────────────────────────
  {
    id: "sa-001",
    type: "coding",
    category: "safety-alignment",
    categoryLabel: "Safety & Alignment",
    difficulty: "core",
    title: "Content Filter Rule Engine",
    tags: ["content-moderation", "rule-engine", "safety"],
    question:
      "Implement a configurable rule-based content filter. The filter should support multiple content categories (e.g., violence, hate-speech, self-harm, sexual) each with independent severity thresholds. Given a piece of text and a set of per-category scores (floats 0-1), the engine should apply the configured rules and return a FilterResult indicating whether the content is allowed, flagged for review, or blocked, along with the list of triggered rules.\n\nRequirements:\n1. Support three actions: ALLOW, FLAG, BLOCK (BLOCK takes priority over FLAG).\n2. Each rule specifies a category, a threshold, and an action.\n3. Rules are evaluated in order; the most severe action wins.\n4. Support an `evaluate(scores: dict[str, float]) -> FilterResult` method.\n5. Support adding and removing rules dynamically.",
    hint: "Use an enum or constants for actions with a defined severity ordering so you can easily compare which action 'wins'.",
    starterCode: `from dataclasses import dataclass, field
from enum import IntEnum
from typing import Optional


class Action(IntEnum):
    ALLOW = 0
    FLAG = 1
    BLOCK = 2


@dataclass
class Rule:
    category: str
    threshold: float
    action: Action


@dataclass
class FilterResult:
    allowed: bool
    action: Action
    triggered_rules: list[Rule]


class ContentFilter:
    """Configurable rule-based content filter."""

    def __init__(self):
        # TODO: initialize rules storage
        pass

    def add_rule(self, rule: Rule) -> None:
        """Add a rule to the filter."""
        # TODO
        pass

    def remove_rule(self, category: str, action: Action) -> bool:
        """Remove a rule by category and action. Return True if removed."""
        # TODO
        pass

    def evaluate(self, scores: dict[str, float]) -> FilterResult:
        """Evaluate content scores against all rules.
        Return a FilterResult with the most severe triggered action."""
        # TODO
        pass
`,
    solution: `from dataclasses import dataclass, field
from enum import IntEnum
from typing import Optional


class Action(IntEnum):
    ALLOW = 0
    FLAG = 1
    BLOCK = 2


@dataclass
class Rule:
    category: str
    threshold: float
    action: Action


@dataclass
class FilterResult:
    allowed: bool
    action: Action
    triggered_rules: list[Rule]


class ContentFilter:
    """Configurable rule-based content filter."""

    def __init__(self):
        self.rules: list[Rule] = []

    def add_rule(self, rule: Rule) -> None:
        self.rules.append(rule)

    def remove_rule(self, category: str, action: Action) -> bool:
        for i, rule in enumerate(self.rules):
            if rule.category == category and rule.action == action:
                self.rules.pop(i)
                return True
        return False

    def evaluate(self, scores: dict[str, float]) -> FilterResult:
        triggered: list[Rule] = []
        worst_action = Action.ALLOW

        for rule in self.rules:
            score = scores.get(rule.category, 0.0)
            if score >= rule.threshold:
                triggered.append(rule)
                if rule.action > worst_action:
                    worst_action = rule.action

        return FilterResult(
            allowed=(worst_action == Action.ALLOW),
            action=worst_action,
            triggered_rules=triggered,
        )
`,
    explanation:
      "The engine stores an ordered list of Rule objects. During evaluation it iterates every rule, checks if the incoming score for that category meets or exceeds the threshold, and tracks the most severe action using the IntEnum ordering (ALLOW < FLAG < BLOCK). The final FilterResult aggregates all triggered rules and reports the worst-case action. Using IntEnum makes severity comparison trivial with standard comparison operators.",
    testCases: [
      {
        input:
          'cf = ContentFilter()\ncf.add_rule(Rule("violence", 0.7, Action.BLOCK))\ncf.add_rule(Rule("hate_speech", 0.5, Action.FLAG))\nresult = cf.evaluate({"violence": 0.8, "hate_speech": 0.6})',
        expected: "result.action == Action.BLOCK and not result.allowed and len(result.triggered_rules) == 2",
      },
      {
        input:
          'cf = ContentFilter()\ncf.add_rule(Rule("violence", 0.7, Action.BLOCK))\nresult = cf.evaluate({"violence": 0.3})',
        expected: "result.action == Action.ALLOW and result.allowed and len(result.triggered_rules) == 0",
      },
      {
        input:
          'cf = ContentFilter()\ncf.add_rule(Rule("hate_speech", 0.4, Action.FLAG))\ncf.add_rule(Rule("hate_speech", 0.8, Action.BLOCK))\nresult = cf.evaluate({"hate_speech": 0.5})',
        expected: "result.action == Action.FLAG and not result.allowed and len(result.triggered_rules) == 1",
      },
      {
        input:
          'cf = ContentFilter()\ncf.add_rule(Rule("sexual", 0.6, Action.FLAG))\nassert cf.remove_rule("sexual", Action.FLAG) == True\nassert cf.remove_rule("sexual", Action.FLAG) == False\nresult = cf.evaluate({"sexual": 0.9})',
        expected: "result.action == Action.ALLOW and result.allowed",
      },
    ],
    timeComplexity: "O(R) per evaluation where R is the number of rules",
    spaceComplexity: "O(R) to store the rules",
  },
  {
    id: "sa-002",
    type: "coding",
    category: "safety-alignment",
    categoryLabel: "Safety & Alignment",
    difficulty: "standard",
    title: "Simple Reward Model Training Loop",
    tags: ["rlhf", "reward-model", "bradley-terry", "pytorch"],
    question:
      "Implement a Bradley-Terry preference model training loop for RLHF. Given pairs of responses where a human has indicated which response is preferred, train a reward model that assigns scalar scores to responses such that preferred responses receive higher scores.\n\nRequirements:\n1. Implement the Bradley-Terry loss: loss = -log(sigmoid(r_preferred - r_rejected)).\n2. The reward model is a simple MLP that maps a fixed-size feature vector to a scalar reward.\n3. Write a `train_step` function that performs one gradient update on a batch of preference pairs.\n4. Write a `compute_accuracy` function that checks how often the model ranks the preferred response higher.\n5. Write a `train_loop` function that trains for N epochs and returns the loss history.",
    hint: "The Bradley-Terry model says P(a preferred over b) = sigmoid(r(a) - r(b)). The loss is just the negative log-likelihood of the observed preferences.",
    starterCode: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset


class RewardModel(nn.Module):
    """Simple MLP reward model: features -> scalar reward."""

    def __init__(self, input_dim: int, hidden_dim: int = 128):
        super().__init__()
        # TODO: define layers
        pass

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Return scalar reward for each input in the batch. Shape: (batch,)"""
        # TODO
        pass


def bradley_terry_loss(
    r_preferred: torch.Tensor, r_rejected: torch.Tensor
) -> torch.Tensor:
    """Compute the Bradley-Terry preference loss.
    Args:
        r_preferred: (batch,) rewards for preferred responses
        r_rejected:  (batch,) rewards for rejected responses
    Returns:
        Scalar mean loss.
    """
    # TODO
    pass


def compute_accuracy(
    model: RewardModel,
    preferred: torch.Tensor,
    rejected: torch.Tensor,
) -> float:
    """Fraction of pairs where model assigns higher reward to preferred."""
    # TODO
    pass


def train_loop(
    model: RewardModel,
    optimizer: optim.Optimizer,
    preferred: torch.Tensor,
    rejected: torch.Tensor,
    epochs: int = 10,
    batch_size: int = 32,
) -> list[float]:
    """Train for the given number of epochs. Return list of per-epoch avg losses."""
    # TODO
    pass
`,
    solution: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset


class RewardModel(nn.Module):
    """Simple MLP reward model: features -> scalar reward."""

    def __init__(self, input_dim: int, hidden_dim: int = 128):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x).squeeze(-1)


def bradley_terry_loss(
    r_preferred: torch.Tensor, r_rejected: torch.Tensor
) -> torch.Tensor:
    return -torch.nn.functional.logsigmoid(r_preferred - r_rejected).mean()


def compute_accuracy(
    model: RewardModel,
    preferred: torch.Tensor,
    rejected: torch.Tensor,
) -> float:
    model.eval()
    with torch.no_grad():
        r_pref = model(preferred)
        r_rej = model(rejected)
    model.train()
    return (r_pref > r_rej).float().mean().item()


def train_loop(
    model: RewardModel,
    optimizer: optim.Optimizer,
    preferred: torch.Tensor,
    rejected: torch.Tensor,
    epochs: int = 10,
    batch_size: int = 32,
) -> list[float]:
    dataset = TensorDataset(preferred, rejected)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    loss_history = []

    model.train()
    for epoch in range(epochs):
        epoch_loss = 0.0
        n_batches = 0
        for pref_batch, rej_batch in loader:
            r_pref = model(pref_batch)
            r_rej = model(rej_batch)
            loss = bradley_terry_loss(r_pref, r_rej)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item()
            n_batches += 1

        loss_history.append(epoch_loss / max(n_batches, 1))

    return loss_history
`,
    explanation:
      "The Bradley-Terry model is the standard formulation used in RLHF reward modeling. It models the probability that response A is preferred over B as sigmoid(r(A) - r(B)). Training maximizes the log-likelihood of observed preferences, which is equivalent to minimizing -log(sigmoid(r_preferred - r_rejected)). The reward model is a simple MLP that produces a scalar score per input. During training, we feed both the preferred and rejected feature vectors through the same model and compute the pairwise loss. Accuracy measures how often the model's ranking agrees with the human preference labels.",
    testCases: [
      {
        input:
          "model = RewardModel(16)\npref = torch.randn(100, 16)\nrej = torch.randn(100, 16)\nopt = optim.Adam(model.parameters(), lr=1e-3)\nlosses = train_loop(model, opt, pref, rej, epochs=5)\nlen(losses)",
        expected: "5",
      },
      {
        input:
          "r_pref = torch.tensor([1.0, 2.0])\nr_rej = torch.tensor([0.0, 0.5])\nloss = bradley_terry_loss(r_pref, r_rej)\nloss.item() > 0",
        expected: "True",
      },
      {
        input:
          "r_pref = torch.tensor([10.0])\nr_rej = torch.tensor([-10.0])\nloss = bradley_terry_loss(r_pref, r_rej)\nloss.item() < 0.001",
        expected: "True (loss approaches 0 when preferred reward is much higher)",
      },
    ],
    timeComplexity: "O(E * N * D) where E=epochs, N=dataset size, D=model forward pass cost",
    spaceComplexity: "O(P) for model parameters P, plus O(B * D) for batch processing",
  },

  // ── Knowledge ───────────────────────────────────────────────────────
  {
    id: "sa-003",
    type: "knowledge",
    category: "safety-alignment",
    categoryLabel: "Safety & Alignment",
    difficulty: "standard",
    title: "Constitutional AI vs RLHF",
    tags: ["constitutional-ai", "rlhf", "alignment", "anthropic"],
    question:
      "How does Constitutional AI (CAI) primarily differ from standard RLHF in the feedback stage?",
    format: "multiple-choice",
    options: [
      "A) CAI uses a larger reward model with more parameters",
      "B) CAI replaces human preference labels with AI-generated feedback guided by a set of written principles",
      "C) CAI skips the reinforcement learning phase entirely and only uses supervised fine-tuning",
      "D) CAI collects preferences from a much larger pool of crowd-workers to reduce individual bias",
    ],
    correctAnswer: "B",
    explanation:
      "Constitutional AI (Bai et al., 2022) replaces the human labelers in the RLHF feedback loop with an AI critic that evaluates and revises model outputs according to a written constitution — a set of explicit principles (e.g., 'Choose the response that is less harmful'). This AI-generated feedback is then used to train a preference model (RLAIF). The key innovation is that the alignment signal comes from principled AI self-critique rather than direct human annotations, making the process more scalable and transparent. The RL phase is still present (ruling out C), the reward model size is not the distinguishing factor (ruling out A), and crowd-worker scale is not the mechanism (ruling out D).",
  },
  {
    id: "sa-004",
    type: "knowledge",
    category: "safety-alignment",
    categoryLabel: "Safety & Alignment",
    difficulty: "core",
    title: "RLHF Pipeline Systems-Level Explanation",
    tags: ["rlhf", "ppo", "reward-model", "alignment-pipeline"],
    question:
      "Explain the full RLHF (Reinforcement Learning from Human Feedback) pipeline from data collection to deployment. Include the three main stages, the role of each model involved, and one key challenge at each stage.",
    format: "short-answer",
    correctAnswer:
      "Stage 1 — Supervised Fine-Tuning (SFT): A pretrained language model is fine-tuned on high-quality demonstration data (prompt + ideal response pairs) written or curated by humans. This produces the SFT model that serves as the starting policy. Key challenge: demonstration data is expensive and may not cover the full distribution of desired behaviors.\n\nStage 2 — Reward Model Training: Human annotators are shown pairs of model responses to the same prompt and asked which they prefer. These preference labels train a reward model (typically initialized from the SFT model with the final layer replaced by a scalar head) using a Bradley-Terry loss. Key challenge: inter-annotator disagreement and systematic biases in labeler preferences can introduce noise and skew the reward signal.\n\nStage 3 — RL Optimization (PPO): The SFT model is further optimized using Proximal Policy Optimization against the frozen reward model. For each prompt the policy generates a response, the reward model scores it, and the PPO update pushes the policy toward higher-reward outputs. A KL penalty between the current policy and the SFT model prevents reward hacking (over-optimizing the reward model in ways that degrade actual quality). Key challenge: reward hacking / over-optimization, where the policy finds adversarial inputs that score high on the reward model but are not genuinely better.\n\nDeployment: The final PPO-tuned model is evaluated on safety and quality benchmarks, potentially undergoes red-teaming, and is deployed with ongoing monitoring.",
    explanation:
      "RLHF is the dominant alignment paradigm used in ChatGPT, Claude, and other frontier models. Understanding the three-stage pipeline (SFT -> Reward Model -> PPO) and the failure modes at each stage is essential for AI safety engineering. The KL constraint in stage 3 is particularly important — without it, the policy quickly learns to exploit the reward model rather than genuinely improve.",
  },

  // ── Open-Ended ──────────────────────────────────────────────────────
  {
    id: "sa-005",
    type: "open-ended",
    category: "safety-alignment",
    categoryLabel: "Safety & Alignment",
    difficulty: "standard",
    title: "Continuous Evaluation System Design",
    tags: ["safety-evaluation", "monitoring", "evals", "production-safety"],
    question:
      "Design a continuous safety evaluation system for a deployed large language model. The system should catch regressions, detect emerging failure modes, and provide actionable signals to the safety team. Describe the architecture, data pipelines, evaluation types, alerting strategy, and how the system handles distribution shift over time.",
    context:
      "Your company operates a customer-facing LLM API. The model is updated periodically (fine-tuning, RLHF iterations, prompt changes). You need a system that runs 24/7 to ensure safety properties hold across updates and changing user behavior.",
    rubric: [
      "Defines a comprehensive evaluation taxonomy (automated red-teaming, benchmark suites, production sampling, adversarial probes)",
      "Describes a data pipeline for collecting and labeling production samples (with privacy considerations)",
      "Includes both pre-deployment (gate) and post-deployment (continuous) evaluation",
      "Addresses distribution shift detection (monitoring input distributions, flagging novel prompt patterns)",
      "Proposes an alerting and escalation framework with severity tiers",
      "Considers human-in-the-loop review for ambiguous cases",
      "Discusses metric design (safety score aggregation, category-level tracking, trend analysis)",
    ],
    sampleAnswer:
      "Architecture Overview: The system has three layers — (1) a pre-deployment gate that blocks model updates failing safety benchmarks, (2) a real-time production monitor that samples and evaluates live traffic, and (3) a periodic deep-evaluation pipeline that runs comprehensive red-team suites.\n\nPre-deployment Gate: Before any model update goes live, it must pass a standardized safety benchmark suite covering known harm categories (violence, CSAM, self-harm, PII leakage, jailbreaks). The suite includes ~5,000 adversarial prompts with known-good reference outputs. A model must maintain parity or improve on every category to pass. Results are tracked over time to detect gradual drift.\n\nReal-time Production Monitor: A sampling layer captures N% of production traffic (configurable per risk tier). Sampled prompt-response pairs are run through a lightweight safety classifier ensemble. Responses flagged above threshold are queued for human review. Metrics are aggregated per category per time window (hourly, daily) and fed into a dashboard.\n\nDeep Evaluation Pipeline: Runs nightly or on-demand. Includes automated red-teaming (an attacker LLM generates adversarial prompts), multi-turn conversation probes, cross-lingual safety checks, and capability evaluations (to detect unexpected capability gains). Results are compared against historical baselines.\n\nDistribution Shift Detection: An embedding-based monitor tracks the distribution of incoming prompts. When the centroid or spread of prompt embeddings deviates significantly (measured by KL divergence or MMD), the system increases the sampling rate and alerts the safety team. A topic-modeling pipeline identifies emerging prompt clusters not well-represented in the eval suite.\n\nAlerting & Escalation: Three severity tiers — (P0) automatic rate-limiting and on-call page for critical safety failures above threshold, (P1) next-business-day review for elevated category scores, (P2) weekly digest for trend anomalies. All alerts include example prompt-response pairs and category breakdowns.\n\nHuman-in-the-Loop: Ambiguous cases from production sampling are routed to a safety review queue. Labeler decisions feed back into the eval suite and reward model training data, creating a flywheel. Inter-rater reliability is tracked to maintain label quality.",
    keyPoints: [
      "Multi-layer evaluation: pre-deployment gates + real-time monitoring + periodic deep evals",
      "Automated red-teaming using adversarial LLMs alongside static benchmark suites",
      "Production traffic sampling with privacy-preserving pipelines",
      "Distribution shift detection via embedding space monitoring",
      "Tiered alerting with automatic escalation for critical failures",
      "Human review flywheel that feeds back into eval and training data",
      "Category-level metric tracking with historical trend analysis",
    ],
  },
  {
    id: "sa-006",
    type: "open-ended",
    category: "safety-alignment",
    categoryLabel: "Safety & Alignment",
    difficulty: "stretch",
    title: "Sociotechnical Risk Evaluation Framework",
    tags: ["ai-risk", "sociotechnical", "governance", "responsible-ai", "deployment-risk"],
    question:
      "Design a comprehensive framework for evaluating the societal risks of deploying a new frontier AI system. The framework should go beyond technical safety benchmarks to consider sociotechnical factors: economic displacement, power concentration, epistemic risks (misinformation at scale), dual-use concerns, and equity of access. Describe the dimensions of evaluation, the stakeholders involved, how you would quantify or assess each risk dimension, and how the framework informs go/no-go deployment decisions.",
    context:
      "Your organization is preparing to release a significantly more capable AI model. Leadership has asked you to design a risk evaluation framework that will be applied before any major capability release. The framework must be rigorous enough to satisfy external auditors while remaining practical enough for engineering teams to implement.",
    rubric: [
      "Identifies multiple distinct risk dimensions beyond model-level safety (economic, epistemic, equity, dual-use, concentration of power)",
      "Proposes concrete assessment methods for each dimension (not just listing risks but explaining how to measure them)",
      "Includes diverse stakeholder engagement (civil society, domain experts, affected communities, not just internal teams)",
      "Describes a structured decision framework (risk matrices, thresholds, mitigations, conditional release)",
      "Addresses temporal dynamics — risks that emerge over time vs. at launch",
      "Considers differential access and equity implications",
      "Proposes mechanisms for ongoing governance and framework updates",
    ],
    sampleAnswer:
      "Framework: Structured Societal Risk Assessment (SSRA)\n\n1. Risk Dimensions & Assessment Methods:\n\n(a) Economic Displacement: Assess which job categories the new capabilities most directly automate. Conduct a task-level analysis (following Eloundou et al.) mapping model capabilities to occupational tasks. Estimate exposure rates for different income quintiles. Engage labor economists for independent review. Metric: percentage of workforce with >50% task exposure, broken down by income level.\n\n(b) Epistemic Risk (Misinformation): Red-team the model's ability to generate convincing disinformation, fake evidence, and persuasive manipulation at scale. Measure the cost-reduction factor for producing misinformation compared to the status quo. Engage media-integrity researchers. Metric: expert-rated persuasiveness of generated disinfo on a Likert scale; estimated cost-reduction multiplier.\n\n(c) Dual-Use / Misuse: Evaluate uplift in dangerous domains (biosecurity, cybersecurity, weapons). Use domain experts to assess whether the model provides meaningful uplift over publicly available information. Conduct controlled uplift studies with appropriate oversight. Metric: expert-assessed uplift rating (none / marginal / significant / critical) per domain.\n\n(d) Power Concentration: Assess whether the capability disproportionately advantages well-resourced actors. Consider: Who can access this? Does it widen or narrow the capability gap between large and small organizations? Metric: qualitative assessment by governance panel.\n\n(e) Equity of Access: Evaluate language coverage, geographic availability, pricing, and whether benefits flow to already-advantaged populations. Metric: coverage breadth (languages, regions, price points) and demographic analysis of early adopters.\n\n2. Stakeholder Engagement: External advisory board including civil society organizations, ethicists, domain experts (biosecurity, economics, information integrity), representatives from vulnerable communities, and government policy advisors. Structured red-team engagements with each group.\n\n3. Decision Framework: A risk matrix maps each dimension to a severity level (low / medium / high / critical). Any single 'critical' rating blocks deployment. 'High' ratings require documented mitigations and conditional release (staged rollout, usage restrictions, enhanced monitoring). The overall assessment produces a risk profile that maps to one of four outcomes: (1) full release, (2) conditional release with mitigations, (3) limited release (API-only, restricted access), (4) hold for further research.\n\n4. Temporal Monitoring: Risks are reassessed quarterly after deployment. An emerging-risk radar tracks leading indicators (unusual usage patterns, reports from civil society, policy developments). The framework itself is versioned and updated annually based on lessons learned.\n\n5. Governance: An independent review board has authority to recommend deployment pauses. All assessments and decisions are documented for external audit. Annual transparency reports are published summarizing risk assessments and decisions.",
    keyPoints: [
      "Multi-dimensional risk taxonomy: economic, epistemic, dual-use, power concentration, equity",
      "Concrete measurement approaches for each dimension, not just risk identification",
      "External stakeholder engagement including civil society and affected communities",
      "Structured go/no-go decision matrix with clear thresholds and escalation paths",
      "Staged/conditional release as a middle ground between full deployment and withholding",
      "Temporal monitoring — risks evolve post-deployment and require ongoing assessment",
      "Governance mechanisms: independent review boards, audit trails, transparency reports",
      "Task-level economic analysis rather than coarse job-level predictions",
    ],
  },
];

export default safetyAlignment;
