const deepLearningLLMs = [
  // ─── Coding Questions ───────────────────────────────────────────────
  {
    id: "dl-001",
    type: "coding",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "standard",
    title: "LoRA Injection into Linear Layers",
    tags: ["lora", "fine-tuning", "parameter-efficient", "pytorch"],
    question:
      "Implement a LoRA (Low-Rank Adaptation) wrapper around a standard `nn.Linear` layer. " +
      "Given a pre-trained linear layer with weight matrix W of shape (out_features, in_features), " +
      "add a low-rank decomposition BA where B is (out_features, r) and A is (r, in_features). " +
      "During the forward pass, the output should be W @ x + (alpha / r) * B @ A @ x. " +
      "The original weight W should be frozen (requires_grad=False) while A and B are trainable. " +
      "Initialize A with Kaiming uniform and B with zeros so the adapter starts as identity.",
    hint:
      "Freeze the original weight by setting requires_grad=False. " +
      "Use nn.Parameter for A and B. The scaling factor alpha/r controls the magnitude of the adapter's contribution.",
    starterCode: `import torch
import torch.nn as nn

class LoRALinear(nn.Module):
    """
    Wraps a pre-trained nn.Linear layer with a low-rank adapter.

    Args:
        linear: Pre-trained nn.Linear layer to wrap.
        rank: Rank r of the low-rank decomposition.
        alpha: Scaling factor for the adapter output.
    """
    def __init__(self, linear: nn.Linear, rank: int = 4, alpha: float = 1.0):
        super().__init__()
        # TODO: Store the frozen original linear layer
        # TODO: Create low-rank parameters A and B
        # TODO: Initialize A with Kaiming uniform and B with zeros
        pass

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # TODO: Compute original output + scaled low-rank adapter output
        pass
`,
    solution: `import torch
import torch.nn as nn
import math

class LoRALinear(nn.Module):
    def __init__(self, linear: nn.Linear, rank: int = 4, alpha: float = 1.0):
        super().__init__()
        self.linear = linear
        self.rank = rank
        self.alpha = alpha

        # Freeze the original weights
        self.linear.weight.requires_grad = False
        if self.linear.bias is not None:
            self.linear.bias.requires_grad = False

        in_features = linear.in_features
        out_features = linear.out_features

        # Low-rank matrices
        self.A = nn.Parameter(torch.empty(rank, in_features))
        self.B = nn.Parameter(torch.zeros(out_features, rank))

        # Initialize A with Kaiming uniform
        nn.init.kaiming_uniform_(self.A, a=math.sqrt(5))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Original frozen forward pass
        base_out = self.linear(x)
        # Low-rank adapter contribution: (alpha / r) * x @ A^T @ B^T
        lora_out = (self.alpha / self.rank) * (x @ self.A.T @ self.B.T)
        return base_out + lora_out
`,
    explanation:
      "LoRA reduces the number of trainable parameters during fine-tuning by injecting low-rank matrices " +
      "into each layer instead of updating the full weight matrix. The key insight is that weight updates " +
      "during adaptation have low intrinsic rank. By decomposing the update as BA (where B is out x r and " +
      "A is r x in), we only train 2 * r * d parameters instead of d^2. Initializing B to zero ensures " +
      "the adapter starts as a no-op, preserving the pre-trained model's behavior at the start of training. " +
      "The scaling factor alpha/r stabilizes training across different rank choices.",
    testCases: [
      "linear = nn.Linear(64, 32); lora = LoRALinear(linear, rank=4, alpha=1.0); x = torch.randn(8, 64); assert lora(x).shape == (8, 32)",
      "linear = nn.Linear(64, 32); lora = LoRALinear(linear, rank=4); assert lora.linear.weight.requires_grad == False",
      "linear = nn.Linear(64, 32); lora = LoRALinear(linear, rank=8); assert lora.A.shape == (8, 64) and lora.B.shape == (32, 8)",
      "linear = nn.Linear(64, 32); lora = LoRALinear(linear, rank=4); assert torch.all(lora.B == 0), 'B should be initialized to zeros'",
      "linear = nn.Linear(16, 16); lora = LoRALinear(linear, rank=4); trainable = sum(p.numel() for p in lora.parameters() if p.requires_grad); assert trainable == 4*16 + 16*4, f'Expected {4*16+16*4} trainable params, got {trainable}'"
    ],
    timeComplexity: "O(n * r * d) for the low-rank forward pass, where n is batch size, r is rank, d is feature dimension",
    spaceComplexity: "O(r * (in_features + out_features)) additional parameters for the adapter"
  },
  {
    id: "dl-002",
    type: "coding",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "stretch",
    title: "DPO Preference Learning Objective",
    tags: ["dpo", "rlhf", "alignment", "preference-learning", "pytorch"],
    question:
      "Implement the Direct Preference Optimization (DPO) loss function. Given log probabilities from " +
      "both the current policy and a reference policy for preferred (chosen) and rejected completions, " +
      "compute the DPO loss. The loss is: -E[log sigmoid(beta * (log_ratio_chosen - log_ratio_rejected))] " +
      "where log_ratio = log_pi(y|x) - log_pi_ref(y|x) for each completion y. " +
      "Return both the scalar loss and the accuracy (fraction where the chosen completion is preferred).",
    hint:
      "The implicit reward for a completion is beta * (log_pi(y|x) - log_pi_ref(y|x)). " +
      "DPO avoids training a separate reward model by directly optimizing the policy using the Bradley-Terry preference model.",
    starterCode: `import torch
import torch.nn.functional as F

def dpo_loss(
    policy_chosen_logps: torch.Tensor,    # Log probs of chosen completions under current policy
    policy_rejected_logps: torch.Tensor,   # Log probs of rejected completions under current policy
    reference_chosen_logps: torch.Tensor,  # Log probs of chosen completions under reference policy
    reference_rejected_logps: torch.Tensor,# Log probs of rejected completions under reference policy
    beta: float = 0.1,                     # Temperature parameter
) -> tuple[torch.Tensor, torch.Tensor]:
    """
    Compute the DPO loss and accuracy.

    Args:
        policy_chosen_logps: (batch_size,) log probs for chosen responses under policy.
        policy_rejected_logps: (batch_size,) log probs for rejected responses under policy.
        reference_chosen_logps: (batch_size,) log probs for chosen responses under reference.
        reference_rejected_logps: (batch_size,) log probs for rejected responses under reference.
        beta: KL penalty coefficient / temperature.

    Returns:
        loss: Scalar DPO loss.
        accuracy: Fraction of examples where chosen is preferred (reward_chosen > reward_rejected).
    """
    # TODO: Compute log ratios for chosen and rejected
    # TODO: Compute DPO loss using the Bradley-Terry model
    # TODO: Compute accuracy
    pass
`,
    solution: `import torch
import torch.nn.functional as F

def dpo_loss(
    policy_chosen_logps: torch.Tensor,
    policy_rejected_logps: torch.Tensor,
    reference_chosen_logps: torch.Tensor,
    reference_rejected_logps: torch.Tensor,
    beta: float = 0.1,
) -> tuple[torch.Tensor, torch.Tensor]:
    # Log ratios: how much the policy differs from the reference
    chosen_log_ratios = policy_chosen_logps - reference_chosen_logps
    rejected_log_ratios = policy_rejected_logps - reference_rejected_logps

    # DPO implicit reward difference
    logits = beta * (chosen_log_ratios - rejected_log_ratios)

    # DPO loss: negative log sigmoid of the reward margin
    loss = -F.logsigmoid(logits).mean()

    # Accuracy: how often the chosen completion has higher implicit reward
    accuracy = (logits > 0).float().mean()

    return loss, accuracy
`,
    explanation:
      "DPO reformulates RLHF as a classification problem on human preference data. Instead of training a " +
      "separate reward model and then optimizing the policy with PPO, DPO directly derives a loss function " +
      "from the closed-form solution of the constrained RL problem. The key insight is that the optimal " +
      "policy under a KL-constrained reward maximization objective satisfies: r(x,y) = beta * log(pi(y|x) / pi_ref(y|x)) + C. " +
      "Substituting this into the Bradley-Terry preference model gives us the DPO loss, which only requires " +
      "log probabilities from the policy and reference model, eliminating the need for a separate reward model. " +
      "The beta parameter controls how much the policy can diverge from the reference -- lower beta allows " +
      "more divergence.",
    testCases: [
      "chosen = torch.tensor([0.0]); rejected = torch.tensor([0.0]); ref_c = torch.tensor([0.0]); ref_r = torch.tensor([0.0]); loss, acc = dpo_loss(chosen, rejected, ref_c, ref_r); assert abs(loss.item() - 0.6931) < 0.01, 'Equal logps should give log(2) loss'",
      "loss, acc = dpo_loss(torch.tensor([-1.0]), torch.tensor([-5.0]), torch.tensor([-1.0]), torch.tensor([-5.0])); assert abs(loss.item() - 0.6931) < 0.01, 'Same ratio difference should give log(2)'",
      "loss, acc = dpo_loss(torch.tensor([-1.0, -1.0]), torch.tensor([-3.0, -3.0]), torch.tensor([-2.0, -2.0]), torch.tensor([-2.0, -2.0]), beta=1.0); assert loss.item() < 0.6931, 'Chosen preferred over rejected should have loss < log(2)'",
      "loss, acc = dpo_loss(torch.tensor([-1.0]), torch.tensor([-3.0]), torch.tensor([-2.0]), torch.tensor([-2.0]), beta=1.0); assert acc.item() == 1.0, 'Accuracy should be 1.0 when chosen is clearly preferred'"
    ],
    timeComplexity: "O(batch_size) -- element-wise operations over the batch",
    spaceComplexity: "O(batch_size) for intermediate tensors"
  },

  // ─── Knowledge Questions ────────────────────────────────────────────
  {
    id: "dl-003",
    type: "knowledge",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "standard",
    title: "Scaling Laws - Kaplan vs Chinchilla",
    tags: ["scaling-laws", "chinchilla", "kaplan", "compute-optimal"],
    question:
      "The original Kaplan et al. (2020) scaling laws and the Chinchilla (Hoffmann et al., 2022) scaling laws " +
      "differ in their recommendations for compute-optimal training. What is the PRIMARY difference in their conclusions?",
    format: "multiple-choice",
    options: [
      "A) Kaplan recommends training larger models on less data, while Chinchilla recommends scaling model size and data equally with compute budget",
      "B) Kaplan recommends using larger batch sizes, while Chinchilla recommends smaller batch sizes with more steps",
      "C) Kaplan applies only to encoder models, while Chinchilla applies only to decoder models",
      "D) Kaplan recommends more training data than model parameters, while Chinchilla recommends the opposite"
    ],
    correctAnswer: "A",
    explanation:
      "Kaplan et al. found that model performance depends most strongly on model size (N), and recommended " +
      "scaling up parameters aggressively while training on relatively less data. Their analysis suggested " +
      "model size should scale faster than dataset size. Chinchilla (Hoffmann et al. 2022) corrected this by " +
      "showing that model size and training tokens should scale roughly equally -- for a given compute budget, " +
      "you should double both parameters and data together. Concretely, Chinchilla showed a 70B model trained " +
      "on 1.4T tokens outperforms a 280B Gopher model trained on 300B tokens using the same compute. This " +
      "had major practical impact: many existing LLMs were 'over-parameterized and under-trained.' The " +
      "Chinchilla-optimal ratio is approximately 20 training tokens per parameter."
  },
  {
    id: "dl-004",
    type: "knowledge",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "core",
    title: "Pre-norm vs Post-norm Transformers",
    tags: ["transformers", "layer-norm", "architecture", "training-stability"],
    question:
      "Modern large language models (GPT-3, LLaMA, PaLM, etc.) almost universally use Pre-LayerNorm " +
      "instead of the original Post-LayerNorm from 'Attention Is All You Need.' " +
      "Explain why Pre-Norm leads to more stable training and what the tradeoff is.",
    format: "short-answer",
    correctAnswer:
      "Pre-Norm applies LayerNorm before the attention/FFN sublayer rather than after. This creates a " +
      "direct residual pathway from input to output without normalization in the critical path, which " +
      "keeps gradient norms well-behaved at initialization regardless of depth. In Post-Norm, gradients " +
      "must flow through the normalization layers in the residual stream, which can cause vanishing " +
      "gradients in deep models and requires careful learning rate warmup. Pre-Norm enables training " +
      "without warmup and is more robust to hyperparameter choices. The tradeoff is that Post-Norm " +
      "can achieve slightly better final performance when training is stable, because the normalization " +
      "after the residual connection provides a stronger regularization effect. Some recent work " +
      "(e.g., DeepNorm) attempts to get the best of both worlds.",
    explanation:
      "In Post-Norm: output = LayerNorm(x + Sublayer(x)). In Pre-Norm: output = x + Sublayer(LayerNorm(x)). " +
      "The key difference is the residual connection. In Pre-Norm, the residual path is completely clean -- " +
      "gradients flow directly from the output back to any earlier layer without passing through LayerNorm. " +
      "This is similar to the benefit of skip connections in ResNets. Post-Norm places the normalization " +
      "in the residual stream, which can amplify or diminish gradients unpredictably. At scale (100+ layers), " +
      "Pre-Norm is essentially required for stable training. Models like GPT-3 and LLaMA use Pre-Norm, " +
      "and LLaMA specifically uses RMSNorm (a simplified Pre-Norm variant) for additional efficiency."
  },
  {
    id: "dl-005",
    type: "knowledge",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "standard",
    title: "FlashAttention IO-awareness",
    tags: ["flashattention", "attention", "gpu-optimization", "memory"],
    question:
      "FlashAttention achieves significant speedups over standard attention despite performing the same " +
      "FLOPs. Explain the core mechanism of how tiling reduces HBM (High Bandwidth Memory) reads and writes, " +
      "and why this matters for attention specifically.",
    format: "short-answer",
    correctAnswer:
      "Standard attention materializes the full N x N attention matrix in HBM (GPU global memory), requiring " +
      "O(N^2) memory reads/writes. FlashAttention uses tiling to compute attention in blocks that fit in " +
      "SRAM (on-chip fast memory), never materializing the full attention matrix. It loads blocks of Q, K, V " +
      "into SRAM, computes partial attention outputs using the online softmax trick (tracking running max and " +
      "sum statistics), and writes only the final output back to HBM. This reduces HBM accesses from O(N^2) " +
      "to O(N^2 * d / M) where M is SRAM size, which is a significant reduction since M >> d for typical " +
      "transformer dimensions. The key insight is that attention is memory-bandwidth-bound (not compute-bound) " +
      "on modern GPUs, so reducing IO is more important than reducing FLOPs.",
    explanation:
      "Modern GPUs have a memory hierarchy: SRAM (on-chip, ~20MB, ~19TB/s) is much faster but smaller than " +
      "HBM (off-chip, ~40-80GB, ~1.5-3TB/s). Standard attention computes S = QK^T (N x N in HBM), applies " +
      "softmax P = softmax(S) (N x N in HBM), then O = PV (reads N x N from HBM). That is 3 full passes " +
      "over an N x N matrix in HBM. FlashAttention's tiling strategy loads small blocks of Q, K, V into SRAM, " +
      "computes the attention for those blocks, and uses the online softmax trick to combine partial results " +
      "without ever storing the full N x N matrix. The online softmax trick maintains running statistics " +
      "(max value and sum of exponentials) that allow correct normalization when processing blocks sequentially. " +
      "For sequence length 2048 and head dim 64, this means processing 32x32 tiles instead of a 2048x2048 " +
      "matrix, dramatically reducing HBM traffic."
  },
  {
    id: "dl-006",
    type: "knowledge",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "standard",
    title: "RLHF Pipeline and Failure Modes",
    tags: ["rlhf", "alignment", "reward-model", "ppo"],
    question:
      "The standard RLHF pipeline has three stages: SFT, Reward Modeling, and RL (PPO). " +
      "Which of the following is a well-known failure mode of this pipeline?",
    format: "multiple-choice",
    options: [
      "A) The SFT model cannot learn from human demonstrations because the pre-trained model is too large",
      "B) Reward hacking: the policy learns to exploit the reward model by generating outputs that score high but are low quality to humans",
      "C) PPO cannot be applied to language models because the action space is continuous",
      "D) The reward model always converges to a uniform distribution over preferences"
    ],
    correctAnswer: "B",
    explanation:
      "Reward hacking (also called reward model over-optimization) is one of the most significant failure " +
      "modes in RLHF. During PPO training, the policy can find adversarial inputs to the reward model -- " +
      "outputs that receive high reward scores but are actually low quality, verbose, repetitive, or otherwise " +
      "undesirable to humans. This happens because the reward model is an imperfect proxy for human preferences. " +
      "As the policy optimizes harder against the reward model, it diverges further from what humans actually " +
      "want. This is why RLHF uses a KL penalty against the SFT/reference policy -- to prevent the policy from " +
      "straying too far into regions where the reward model is unreliable. Even with the KL penalty, careful " +
      "tuning of the KL coefficient is needed. Option A is wrong because SFT works well at all scales. " +
      "Option C is wrong because language model actions (tokens) are discrete. Option D is wrong because " +
      "reward models successfully learn preference rankings from human comparison data."
  },

  // ─── Open-Ended Questions ──────────────────────────────────────────
  {
    id: "dl-007",
    type: "open-ended",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "standard",
    title: "Comparing Transformer Variant Efficiency",
    tags: ["transformers", "mha", "mqa", "gqa", "inference-optimization"],
    question:
      "Compare Multi-Head Attention (MHA), Multi-Query Attention (MQA), and Grouped-Query Attention (GQA) " +
      "in terms of quality, training cost, inference throughput, and KV-cache memory usage. When would you " +
      "choose each variant for a production LLM deployment?",
    context:
      "MHA uses separate K, V projections per head. MQA shares a single K, V head across all query heads. " +
      "GQA groups query heads and shares K, V within each group. Models like PaLM use MQA, LLaMA-2 70B " +
      "uses GQA, and GPT-3 uses standard MHA. Consider both training and inference scenarios.",
    rubric: [
      "Correctly describes the KV sharing mechanism in each variant",
      "Analyzes KV-cache memory reduction quantitatively (e.g., MQA = 1/num_heads, GQA = num_groups/num_heads)",
      "Discusses quality tradeoffs -- MQA can degrade quality, GQA recovers most quality",
      "Addresses inference throughput improvements from reduced memory bandwidth",
      "Considers the training cost perspective (MQA/GQA slightly faster training too)",
      "Provides clear recommendation criteria based on model size, serving constraints, and latency requirements"
    ],
    sampleAnswer:
      "Multi-Head Attention (MHA) gives each of the H attention heads its own Key and Value projections, " +
      "resulting in a KV-cache of size 2 * L * H * d_head * batch * seq_len per layer. This provides " +
      "maximum representational capacity but becomes a memory bottleneck during inference, especially " +
      "for long sequences.\n\n" +
      "Multi-Query Attention (MQA) uses a single shared K and V head for all H query heads, reducing " +
      "the KV-cache by a factor of H (e.g., 32x for a 32-head model). This dramatically improves " +
      "inference throughput since attention is typically memory-bandwidth-bound during autoregressive " +
      "decoding. However, MQA can degrade model quality, particularly for smaller models, because " +
      "the shared KV heads limit the model's ability to attend to different aspects of the input " +
      "in different heads.\n\n" +
      "Grouped-Query Attention (GQA) is a compromise: query heads are divided into G groups, with each " +
      "group sharing one K, V head. With G groups and H query heads, the KV-cache is reduced by H/G. " +
      "For example, LLaMA-2 70B uses 8 KV heads with 64 query heads (G=8), giving an 8x reduction. " +
      "GQA recovers nearly all the quality of MHA while retaining most of MQA's inference benefits.\n\n" +
      "Recommendations: Use MHA for smaller models where KV-cache is not a bottleneck. Use GQA for " +
      "large production models (70B+) where you need a balance of quality and serving efficiency. " +
      "Use MQA only when inference latency is the absolute priority and you can tolerate slight quality " +
      "loss, or when the model is large enough that the quality impact is minimal.",
    keyPoints: [
      "MHA: Full KV per head, best quality, highest memory cost",
      "MQA: Single shared KV, biggest memory savings (1/H), potential quality loss",
      "GQA: Grouped KV sharing, tunable tradeoff (H/G reduction), near-MHA quality",
      "KV-cache is the inference bottleneck for autoregressive decoding, not compute",
      "GQA is the current industry standard for large models (LLaMA-2, Mistral)",
      "The quality gap between MQA and MHA shrinks as model size increases"
    ]
  },
  {
    id: "dl-008",
    type: "open-ended",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "stretch",
    title: "Red-Team Evaluation Plan",
    tags: ["red-teaming", "safety", "evaluation", "alignment"],
    question:
      "You are responsible for designing a systematic red-teaming evaluation plan for a new large language " +
      "model before public deployment. Describe your approach, including the categories of risks you would " +
      "test for, the methodology for generating test cases, how you would measure severity, and how you " +
      "would handle discovered vulnerabilities.",
    context:
      "Red-teaming is the practice of adversarially probing an AI system to discover failure modes, safety " +
      "issues, and harmful capabilities before deployment. Major labs (OpenAI, Anthropic, DeepMind) all " +
      "conduct extensive red-teaming. Consider both automated and human red-teaming approaches, and think " +
      "about how to make the process systematic rather than ad-hoc.",
    rubric: [
      "Defines a comprehensive taxonomy of risk categories (harmful content, jailbreaks, bias, privacy, misuse, etc.)",
      "Describes both automated and human red-teaming methodologies",
      "Explains how to systematically generate diverse test cases rather than relying on ad-hoc prompts",
      "Proposes a severity scoring framework for discovered vulnerabilities",
      "Addresses the iterative nature of red-teaming (test -> fix -> re-test)",
      "Considers the role of domain experts for specialized risks (biosecurity, cybersecurity, etc.)",
      "Discusses how to translate findings into concrete mitigations"
    ],
    sampleAnswer:
      "A systematic red-teaming plan should cover five phases:\n\n" +
      "1. RISK TAXONOMY: Define categories including (a) harmful content generation (violence, CSAM, " +
      "self-harm), (b) jailbreak robustness (prompt injection, role-playing exploits, multi-turn " +
      "manipulation), (c) bias and stereotyping (demographic biases, cultural insensitivity), " +
      "(d) privacy leakage (PII extraction, training data regurgitation), (e) dangerous knowledge " +
      "(bioweapons synthesis, cyberattack instructions), and (f) deceptive behavior (sycophancy, " +
      "unfaithful reasoning, hallucination).\n\n" +
      "2. TEST CASE GENERATION: Use a hybrid approach. Automated methods include: adversarial prompt " +
      "generation using another LLM (e.g., red-LM that generates attacks), template-based fuzzing with " +
      "known jailbreak patterns (prefix injection, base64 encoding, translation attacks), and gradient-based " +
      "attacks (GCG-style token optimization). Human methods include: expert red-teamers with domain " +
      "knowledge, crowd-sourced red-teaming with diverse participants, and structured brainstorming " +
      "using attack trees.\n\n" +
      "3. SEVERITY FRAMEWORK: Score each finding on (a) likelihood of occurrence in normal use (1-5), " +
      "(b) severity of harm if exploited (1-5: 1=minor bias, 5=imminent physical danger), (c) ease of " +
      "reproduction (trivial/moderate/requires expertise), and (d) breadth of impact (single edge case " +
      "vs. systematic failure). Combine into a priority matrix: Critical/High/Medium/Low.\n\n" +
      "4. DOMAIN EXPERT EVALUATION: Engage subject matter experts for specialized risks. Biosecurity " +
      "experts evaluate uplift potential for bioweapons knowledge. Cybersecurity experts test for " +
      "novel exploit generation. Legal experts assess liability exposure. Social scientists evaluate " +
      "bias patterns.\n\n" +
      "5. MITIGATION AND ITERATION: For each finding, determine mitigation: (a) training-time fixes " +
      "(additional RLHF data, constitutional AI rules), (b) inference-time guardrails (output classifiers, " +
      "input filters), or (c) system-level controls (rate limiting, monitoring). Re-test after each " +
      "mitigation to verify fixes and check for regressions. Maintain a living vulnerability database " +
      "and conduct ongoing red-teaming post-deployment.",
    keyPoints: [
      "Systematic taxonomy of risk categories rather than ad-hoc testing",
      "Combination of automated and human red-teaming for coverage",
      "Structured severity scoring to prioritize remediation efforts",
      "Domain experts for specialized risks (bio, cyber, etc.)",
      "Iterative test-fix-retest cycle with regression testing",
      "Both training-time and inference-time mitigations",
      "Ongoing post-deployment red-teaming, not just pre-launch"
    ]
  }
];

export default deepLearningLLMs;
