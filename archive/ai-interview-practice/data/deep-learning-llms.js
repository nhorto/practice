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
  },
  {
    id: "dl-009",
    type: "knowledge",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "core",
    title: "Prompt Engineering Techniques",
    tags: ["prompt-engineering", "few-shot", "chain-of-thought"],
    question:
      "Compare zero-shot, few-shot, chain-of-thought (CoT), self-consistency, and tree-of-thought (ToT) prompting. For each technique, explain what it does, when to use it, and its primary limitation.",
    format: "short-answer",
    correctAnswer:
      "Zero-shot: Prompt the model with only the task description, no examples. Works for tasks the model has seen extensively during training. Limitation: fails on novel tasks requiring multi-step reasoning or domain-specific formats.\n\nFew-shot: Include 3-10 labeled examples in the prompt before the query. Dramatically improves accuracy on structured output tasks and domain-specific formats. Limitation: consumes context window, sensitive to example selection and order, expensive at inference time.\n\nChain-of-Thought (CoT): Prompt the model to produce intermediate reasoning steps before the final answer ('Let's think step by step'). Significantly improves performance on arithmetic, commonsense, and multi-step reasoning tasks. Limitation: only effective for models above ~100B parameters; incorrect reasoning chains can still lead to wrong answers.\n\nSelf-Consistency: Generate N independent CoT reasoning paths (via sampling with temperature > 0), then take the majority vote over the final answers. Improves accuracy by 5-15% on reasoning benchmarks over single-sample CoT. Limitation: N× more expensive; ineffective when the majority of paths make the same systematic error.\n\nTree-of-Thought (ToT): Decompose the problem into a tree of intermediate steps, generating and evaluating multiple candidates at each step using a value function (LLM or heuristic). Enables backtracking and deliberate search over reasoning paths. Limitation: much more expensive and complex to implement than CoT or self-consistency; overkill for most tasks.",
    explanation:
      "Prompting techniques form a progression from simple to complex: zero-shot (no examples) -> few-shot (examples) -> CoT (reasoning traces) -> self-consistency (sampling + voting) -> ToT (search over reasoning trees). The right technique depends on task complexity, model size, latency tolerance, and cost budget. For most production applications, few-shot + CoT is the sweet spot. Self-consistency is reserved for high-stakes accuracy-critical tasks. ToT is primarily a research technique for extremely hard planning problems.",
  },
  {
    id: "dl-010",
    type: "knowledge",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "standard",
    title: "KV Cache and Inference Optimization",
    tags: ["kv-cache", "inference", "quantization", "optimization"],
    question:
      "Explain the KV cache and four inference optimization techniques: speculative decoding, continuous batching, INT8 quantization, and GPTQ/AWQ weight-only quantization. For each, describe the mechanism and the primary tradeoff.",
    format: "short-answer",
    correctAnswer:
      "KV Cache: During autoregressive generation, the key and value tensors from past tokens in the attention layers are cached so they don't need to be recomputed for each new token. Without a KV cache, generating T tokens requires O(T^2) attention computations; with a KV cache it's O(T). The tradeoff: the cache grows linearly with sequence length and batch size, consuming significant GPU memory (see PagedAttention for management).\n\nSpeculative Decoding: A fast small 'draft' model generates K tokens in parallel, then the large 'verifier' model checks all K tokens in a single forward pass (which is only marginally more expensive than checking 1 token due to parallelism). Accepted tokens are kept; the first rejected token triggers resampling. Typical speedup: 2-4x for latency-bound generation with matching token distribution. Tradeoff: requires a well-matched draft model; acceptance rate drops if draft model quality is poor.\n\nContinuous Batching: Rather than waiting for all sequences in a batch to finish before processing new ones, the scheduler slots new sequences into positions vacated by completed sequences at each decode iteration. This keeps the batch full and GPU utilization high. Tradeoff: more complex scheduler; sequences in the same batch may have very different lengths, requiring padding or dynamic batching.\n\nINT8 Activation + Weight Quantization (LLM.int8): Quantize both activations and weights to INT8 during linear layer computation. Use absmax per-channel scaling to limit quantization error. Reduces memory by ~2x with <1% quality degradation on most benchmarks. Tradeoff: requires calibration data; some outlier activations require mixed-precision handling (LLM.int8 handles this with vector-wise decomposition).\n\nGPTQ/AWQ (Weight-Only Quantization): Quantize model weights to INT4 or INT3 at inference time while keeping activations in FP16. GPTQ uses second-order information (Hessian) to minimize quantization error layer by layer. AWQ identifies the ~1% of salient weights and protects them. Result: 4-bit models run at ~4x less memory with 2-4x speedup on memory-bandwidth-bound decode. Tradeoff: INT4 GPTQ has ~1-2% quality loss vs FP16; requires a one-time expensive quantization step.",
    explanation:
      "LLM inference optimization is an active research and engineering area because autoregressive decode is inherently sequential and memory-bandwidth-bound. The optimization hierarchy: (1) KV cache is mandatory for any production deployment; (2) quantization (INT8 or INT4) reduces memory pressure and increases effective batch size; (3) speculative decoding reduces latency for interactive applications; (4) continuous batching maximizes throughput for serving systems. These techniques are complementary and are all used simultaneously in production inference engines like vLLM and TGI.",
  },
  {
    id: "dl-011",
    type: "coding",
    category: "deep-learning-llms",
    categoryLabel: "Deep Learning & LLMs",
    difficulty: "stretch",
    title: "Distributed Training with FSDP",
    tags: ["fsdp", "distributed-training", "activation-checkpointing"],
    question:
      "Implement a PyTorch FSDP training script for a transformer model. The script should: (1) wrap the model with FSDP using a transformer auto-wrap policy, (2) enable activation checkpointing on each transformer block, (3) use a mixed-precision policy (BF16 for parameters and activations, FP32 for reduction), and (4) implement a correct distributed training loop with gradient clipping. The script should initialize the distributed process group and clean up properly.",
    hint: "Use transformer_auto_wrap_policy with the specific TransformerBlock class. Activation checkpointing in FSDP uses checkpoint_wrapper applied before FSDP wrapping. Mixed precision is configured via MixedPrecision. Remember that FSDP allreduces gradients automatically — do NOT call loss.backward() inside no_sync() unless you intend to accumulate.",
    starterCode: `import torch
import torch.nn as nn
import torch.distributed as dist
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp import MixedPrecision
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy
from torch.distributed.algorithms._checkpoint.checkpoint_wrapper import (
    checkpoint_wrapper,
    CheckpointImpl,
    apply_activation_checkpointing,
)
import functools
import os


class TransformerBlock(nn.Module):
    """A single transformer block (attention + FFN). Stand-in for a real block."""
    def __init__(self, d_model: int, nhead: int, dim_feedforward: int):
        super().__init__()
        self.attn = nn.MultiheadAttention(d_model, nhead, batch_first=True)
        self.ff = nn.Sequential(
            nn.Linear(d_model, dim_feedforward),
            nn.GELU(),
            nn.Linear(dim_feedforward, d_model),
        )
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)

    def forward(self, x):
        attn_out, _ = self.attn(x, x, x)
        x = self.norm1(x + attn_out)
        x = self.norm2(x + self.ff(x))
        return x


class SimpleTransformer(nn.Module):
    def __init__(self, d_model=512, nhead=8, num_layers=6, vocab_size=32000):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, d_model)
        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, nhead, d_model * 4)
            for _ in range(num_layers)
        ])
        self.head = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        x = self.embed(x)
        for block in self.blocks:
            x = block(x)
        return self.head(x)


def setup(rank: int, world_size: int):
    """Initialize the distributed process group."""
    # TODO: init_process_group with nccl backend
    pass


def teardown():
    """Clean up the distributed process group."""
    # TODO
    pass


def wrap_model_with_fsdp(model: nn.Module) -> FSDP:
    """
    Wrap the model with FSDP:
    1. Use transformer_auto_wrap_policy for TransformerBlock
    2. Apply BF16 mixed precision
    3. Apply activation checkpointing to each TransformerBlock
    """
    # TODO
    pass


def train(rank: int, world_size: int):
    setup(rank, world_size)
    torch.cuda.set_device(rank)

    model = SimpleTransformer().to(rank)
    model = wrap_model_with_fsdp(model)

    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)

    # TODO: Implement training loop
    # - Generate a random batch of token IDs
    # - Forward pass, compute cross-entropy loss
    # - Backward pass with gradient clipping (max_norm=1.0)
    # - Optimizer step

    teardown()


if __name__ == "__main__":
    world_size = torch.cuda.device_count()
    torch.multiprocessing.spawn(train, args=(world_size,), nprocs=world_size, join=True)
`,
    solution: `import torch
import torch.nn as nn
import torch.distributed as dist
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp import MixedPrecision, ShardingStrategy
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy
from torch.distributed.algorithms._checkpoint.checkpoint_wrapper import (
    checkpoint_wrapper,
    CheckpointImpl,
    apply_activation_checkpointing,
)
import functools
import os


class TransformerBlock(nn.Module):
    def __init__(self, d_model: int, nhead: int, dim_feedforward: int):
        super().__init__()
        self.attn = nn.MultiheadAttention(d_model, nhead, batch_first=True)
        self.ff = nn.Sequential(
            nn.Linear(d_model, dim_feedforward),
            nn.GELU(),
            nn.Linear(dim_feedforward, d_model),
        )
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)

    def forward(self, x):
        attn_out, _ = self.attn(x, x, x)
        x = self.norm1(x + attn_out)
        x = self.norm2(x + self.ff(x))
        return x


class SimpleTransformer(nn.Module):
    def __init__(self, d_model=512, nhead=8, num_layers=6, vocab_size=32000):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, d_model)
        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, nhead, d_model * 4)
            for _ in range(num_layers)
        ])
        self.head = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        x = self.embed(x)
        for block in self.blocks:
            x = block(x)
        return self.head(x)


def setup(rank: int, world_size: int):
    os.environ["MASTER_ADDR"] = "localhost"
    os.environ["MASTER_PORT"] = "12355"
    dist.init_process_group(backend="nccl", rank=rank, world_size=world_size)


def teardown():
    dist.destroy_process_group()


def wrap_model_with_fsdp(model: nn.Module) -> FSDP:
    # BF16 mixed precision: parameters and activations in BF16, reductions in FP32
    bf16_policy = MixedPrecision(
        param_dtype=torch.bfloat16,
        reduce_dtype=torch.float32,
        buffer_dtype=torch.bfloat16,
    )

    # Auto-wrap policy: shard at TransformerBlock boundaries
    auto_wrap_policy = functools.partial(
        transformer_auto_wrap_policy,
        transformer_layer_cls={TransformerBlock},
    )

    # Apply activation checkpointing to each TransformerBlock before FSDP wrapping
    non_reentrant_wrapper = functools.partial(
        checkpoint_wrapper,
        checkpoint_impl=CheckpointImpl.NO_REENTRANT,
    )
    check_fn = lambda submodule: isinstance(submodule, TransformerBlock)
    apply_activation_checkpointing(model, checkpoint_wrapper_fn=non_reentrant_wrapper, check_fn=check_fn)

    # Wrap with FSDP (ZeRO Stage 3 = FULL_SHARD)
    fsdp_model = FSDP(
        model,
        auto_wrap_policy=auto_wrap_policy,
        mixed_precision=bf16_policy,
        sharding_strategy=ShardingStrategy.FULL_SHARD,
        device_id=torch.cuda.current_device(),
    )
    return fsdp_model


def train(rank: int, world_size: int):
    setup(rank, world_size)
    torch.cuda.set_device(rank)

    model = SimpleTransformer().to(rank)
    model = wrap_model_with_fsdp(model)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)

    # Training loop
    for step in range(10):
        # Random batch: (batch_size=4, seq_len=128)
        input_ids = torch.randint(0, 32000, (4, 128), device=rank)
        labels = torch.randint(0, 32000, (4, 128), device=rank)

        optimizer.zero_grad()
        logits = model(input_ids)  # (4, 128, vocab_size)
        loss = torch.nn.functional.cross_entropy(
            logits.view(-1, logits.size(-1)), labels.view(-1)
        )
        loss.backward()

        # Gradient clipping must happen before optimizer.step()
        # FSDP exposes clip_grad_norm_ directly
        model.clip_grad_norm_(max_norm=1.0)

        optimizer.step()

        if rank == 0:
            print(f"Step {step}: loss = {loss.item():.4f}")

    teardown()


if __name__ == "__main__":
    world_size = torch.cuda.device_count()
    torch.multiprocessing.spawn(train, args=(world_size,), nprocs=world_size, join=True)
`,
    explanation:
      "FSDP (Fully Sharded Data Parallel) is PyTorch's implementation of ZeRO Stage 3: parameters, gradients, and optimizer states are all sharded across ranks. The transformer_auto_wrap_policy is critical — it tells FSDP to shard at TransformerBlock boundaries, which is more efficient than sharding every individual layer. Activation checkpointing must be applied before FSDP wrapping because FSDP needs to see the final module structure. The NO_REENTRANT checkpoint implementation avoids compatibility issues with FSDP's custom backward hooks. MixedPrecision configures BF16 for compute (faster on H100) with FP32 for gradient reductions (for numerical stability). FSDP.clip_grad_norm_ is used instead of torch.nn.utils.clip_grad_norm_ because FSDP shards gradients — the standard function would only see each rank's shard and compute an incorrect norm.",
    testCases: [
      {
        input: "Run with world_size=2 on 2 GPUs",
        expected: "Both ranks initialize, loss decreases over 10 steps, process group cleans up without error",
      },
      {
        input: "Check that model.clip_grad_norm_(1.0) is used instead of torch.nn.utils.clip_grad_norm_",
        expected: "FSDP-aware gradient clipping produces correct global gradient norm across all shards",
      },
      {
        input: "Inspect memory usage after FSDP wrapping",
        expected: "Each GPU holds ~1/world_size of model parameters rather than the full model",
      },
    ],
    timeComplexity: "O(steps * batch_size * seq_len * model_params / world_size) — linear scale-out with world_size",
    spaceComplexity: "O(model_params / world_size) per GPU for sharded parameters, plus O(batch * seq_len * d_model) for activations",
  },
];

export default deepLearningLLMs;
