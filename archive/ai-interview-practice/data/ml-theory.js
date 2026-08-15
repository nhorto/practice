const mlTheory = [
  // ─── Coding Questions ───────────────────────────────────────────────
  {
    id: "ml-001",
    type: "coding",
    category: "ml-theory",
    categoryLabel: "ML Theory",
    difficulty: "core",
    title: "Stable Softmax + Cross-Entropy",
    tags: ["numerical-stability", "softmax", "cross-entropy", "log-sum-exp"],
    question:
      "Implement a numerically stable softmax function and cross-entropy loss using the log-sum-exp trick. " +
      "Naive computation of softmax overflows for large logits and underflows for very negative logits. " +
      "Your implementation should handle arbitrary real-valued logit vectors without producing NaN or Inf.",
    hint:
      "Subtract the maximum logit before exponentiating: softmax(z)_i = exp(z_i - max(z)) / sum(exp(z_j - max(z))). " +
      "For cross-entropy, combine the log and softmax into a single numerically stable expression using log-sum-exp.",
    starterCode: `import numpy as np

def stable_softmax(logits: np.ndarray) -> np.ndarray:
    """Compute softmax in a numerically stable way.

    Args:
        logits: 1-D array of raw logit scores (shape [C]).

    Returns:
        Probability distribution over C classes (shape [C]).
    """
    # TODO: implement using the log-sum-exp trick
    pass


def stable_cross_entropy(logits: np.ndarray, target: int) -> float:
    """Compute cross-entropy loss between logits and a hard target label.

    Args:
        logits: 1-D array of raw logit scores (shape [C]).
        target: Integer index of the correct class (0-indexed).

    Returns:
        Scalar cross-entropy loss.
    """
    # TODO: implement a numerically stable version
    pass
`,
    solution: `import numpy as np

def stable_softmax(logits: np.ndarray) -> np.ndarray:
    shifted = logits - np.max(logits)
    exps = np.exp(shifted)
    return exps / np.sum(exps)


def stable_cross_entropy(logits: np.ndarray, target: int) -> float:
    # log-sum-exp trick: log(sum(exp(z))) = max(z) + log(sum(exp(z - max(z))))
    max_logit = np.max(logits)
    log_sum_exp = max_logit + np.log(np.sum(np.exp(logits - max_logit)))
    return -(logits[target] - log_sum_exp)
`,
    explanation:
      "The naive softmax computes exp(z_i) / sum(exp(z_j)), which overflows when logits are large. " +
      "Subtracting max(z) from all logits before exponentiating guarantees the largest exponent is exp(0) = 1, " +
      "preventing overflow while producing mathematically identical results (the constant cancels in the ratio). " +
      "For cross-entropy, we avoid taking log(softmax) separately (which loses precision) and instead use the identity: " +
      "-log(softmax(z)_k) = -z_k + log(sum(exp(z_j))), then stabilize log-sum-exp with the same max-subtraction trick.",
    testCases: [
      {
        input: "logits = np.array([1.0, 2.0, 3.0]), target = 2",
        expected: "softmax ~ [0.0900, 0.2447, 0.6652], CE ~ 0.4076",
      },
      {
        input: "logits = np.array([1000.0, 1001.0, 1002.0]), target = 2",
        expected: "softmax ~ [0.0900, 0.2447, 0.6652], CE ~ 0.4076 (no overflow)",
      },
      {
        input: "logits = np.array([-1000.0, -999.0, -998.0]), target = 0",
        expected: "softmax ~ [0.0900, 0.2447, 0.6652], CE ~ 2.4076 (no underflow)",
      },
      {
        input: "logits = np.array([0.0, 0.0, 0.0]), target = 1",
        expected: "softmax = [1/3, 1/3, 1/3], CE ~ 1.0986",
      },
    ],
    timeComplexity: "O(C) where C is the number of classes",
    spaceComplexity: "O(C)",
  },

  {
    id: "ml-002",
    type: "coding",
    category: "ml-theory",
    categoryLabel: "ML Theory",
    difficulty: "standard",
    title: "Importance Sampling Estimator",
    tags: ["importance-sampling", "monte-carlo", "probability", "estimation"],
    question:
      "Implement an importance sampling estimator. Given samples drawn from a proposal distribution q(x), " +
      "estimate the expected value of a function f(x) under a target distribution p(x). " +
      "Implement both the basic IS estimator and the self-normalized IS estimator. " +
      "The self-normalized version divides by the sum of importance weights, which reduces variance when " +
      "the normalizing constants of p or q are unknown.",
    hint:
      "Basic IS: E_p[f(x)] ~ (1/N) * sum(w_i * f(x_i)) where w_i = p(x_i)/q(x_i). " +
      "Self-normalized IS: E_p[f(x)] ~ sum(w_i * f(x_i)) / sum(w_i). " +
      "Use log-space computation for the weights to avoid numerical issues.",
    starterCode: `import numpy as np

def importance_sampling(
    f_values: np.ndarray,
    log_p: np.ndarray,
    log_q: np.ndarray,
) -> float:
    """Basic importance sampling estimator.

    Args:
        f_values: f(x_i) evaluated at each sample (shape [N]).
        log_p: log p(x_i) under the target distribution (shape [N]).
        log_q: log q(x_i) under the proposal distribution (shape [N]).

    Returns:
        Estimated E_p[f(x)].
    """
    # TODO: implement basic IS estimator
    pass


def self_normalized_importance_sampling(
    f_values: np.ndarray,
    log_p: np.ndarray,
    log_q: np.ndarray,
) -> float:
    """Self-normalized importance sampling estimator.

    Args:
        f_values: f(x_i) evaluated at each sample (shape [N]).
        log_p: log p(x_i) under the target distribution (shape [N]).
        log_q: log q(x_i) under the proposal distribution (shape [N]).

    Returns:
        Estimated E_p[f(x)] using self-normalized weights.
    """
    # TODO: implement self-normalized IS estimator
    pass
`,
    solution: `import numpy as np

def importance_sampling(
    f_values: np.ndarray,
    log_p: np.ndarray,
    log_q: np.ndarray,
) -> float:
    log_weights = log_p - log_q
    # Stabilize by subtracting max before exponentiating
    log_weights_stable = log_weights - np.max(log_weights)
    weights = np.exp(log_weights_stable)
    # Correct for the shift: multiply back by exp(max)
    # But since we take the mean, we can factor it:
    # Actually for basic IS we just exponentiate directly
    weights = np.exp(log_weights)
    return np.mean(weights * f_values)


def self_normalized_importance_sampling(
    f_values: np.ndarray,
    log_p: np.ndarray,
    log_q: np.ndarray,
) -> float:
    log_weights = log_p - log_q
    # Stabilize via log-sum-exp trick
    max_log_w = np.max(log_weights)
    weights = np.exp(log_weights - max_log_w)
    return np.sum(weights * f_values) / np.sum(weights)
`,
    explanation:
      "Importance sampling lets us estimate expectations under p(x) using samples from a different distribution q(x). " +
      "The key identity is E_p[f(x)] = E_q[f(x) * p(x)/q(x)]. The ratio w(x) = p(x)/q(x) is the importance weight. " +
      "The self-normalized estimator divides by sum(w_i) instead of N, which is crucial when p or q are only known " +
      "up to a normalizing constant (common in Bayesian inference). The max-subtraction trick in log-space prevents " +
      "overflow/underflow. The self-normalized version is biased but consistent, with typically lower variance.",
    testCases: [
      {
        input:
          "f_values = np.ones(1000), log_p = norm.logpdf(x, 0, 1), log_q = norm.logpdf(x, 0, 1)",
        expected: "~1.0 (identical distributions, so E[1] = 1)",
      },
      {
        input:
          "f_values = x, log_p = norm.logpdf(x, 2, 1), log_q = norm.logpdf(x, 0, 1), x ~ N(0,1)",
        expected: "~2.0 (estimating the mean of target N(2,1))",
      },
      {
        input:
          "f_values = x**2, log_p = norm.logpdf(x, 0, 1), log_q = norm.logpdf(x, 0, 2), x ~ N(0,2)",
        expected: "~1.0 (E[X^2] for standard normal = variance = 1)",
      },
    ],
    timeComplexity: "O(N) where N is the number of samples",
    spaceComplexity: "O(N)",
  },

  // ─── Knowledge Questions ────────────────────────────────────────────
  {
    id: "ml-003",
    type: "knowledge",
    category: "ml-theory",
    categoryLabel: "ML Theory",
    difficulty: "core",
    title: "Cross-Entropy/MLE Equivalence",
    tags: ["cross-entropy", "maximum-likelihood", "loss-functions", "information-theory"],
    question:
      "Why is minimizing cross-entropy loss equivalent to maximizing the likelihood of the data?",
    format: "multiple-choice",
    options: [
      "A) Cross-entropy equals the negative log-likelihood plus a constant (the data entropy), so minimizing one minimizes the other.",
      "B) Cross-entropy and likelihood are completely unrelated but happen to find the same optimum by coincidence.",
      "C) Cross-entropy minimizes the KL divergence from the model to the data, while MLE maximizes the KL divergence from the data to the model.",
      "D) They are only equivalent for binary classification, not for multi-class problems.",
    ],
    correctAnswer: "A",
    explanation:
      "Cross-entropy H(p, q) = H(p) + D_KL(p || q), where H(p) is the entropy of the true distribution (a constant " +
      "with respect to model parameters) and D_KL(p || q) is the KL divergence. Therefore minimizing cross-entropy is " +
      "equivalent to minimizing KL divergence. Separately, the negative log-likelihood of the data under the model is: " +
      "-1/N * sum(log q(y_i | x_i)) which is exactly the empirical cross-entropy. Since H(p) doesn't depend on model " +
      "parameters, argmin H(p, q) = argmin D_KL(p || q) = argmax likelihood. This equivalence holds for any classification " +
      "problem (binary or multi-class) and is a foundational connection between information theory and statistical estimation.",
  },

  {
    id: "ml-004",
    type: "knowledge",
    category: "ml-theory",
    categoryLabel: "ML Theory",
    difficulty: "core",
    title: "Gradient Vanishing/Exploding",
    tags: ["gradients", "deep-learning", "training", "backpropagation"],
    question:
      "Explain the vanishing and exploding gradient problems in deep networks. What causes each, and what are the main solutions?",
    format: "short-answer",
    options: null,
    correctAnswer:
      "Vanishing gradients occur when gradients shrink exponentially through layers during backpropagation, " +
      "typically caused by saturating activations (sigmoid, tanh) or poor weight initialization. Exploding gradients " +
      "occur when gradients grow exponentially, often due to large weight magnitudes. Solutions include: (1) ReLU-family " +
      "activations that don't saturate for positive inputs, (2) careful initialization (Xavier/He), (3) residual " +
      "connections (skip connections) that provide gradient highways, (4) batch/layer normalization to control activation " +
      "scales, (5) gradient clipping for exploding gradients, and (6) LSTM/GRU gating mechanisms for RNNs.",
    explanation:
      "During backpropagation, gradients are computed via the chain rule as a product of local gradients across layers. " +
      "If each local gradient has magnitude < 1 (e.g., sigmoid derivative max is 0.25), the product shrinks exponentially " +
      "with depth, making early layers nearly untrainable. Conversely, if local gradients are > 1, the product explodes. " +
      "This was a major barrier to training deep networks before modern techniques. Residual connections are particularly " +
      "effective because they add an identity path: the gradient of the skip connection is 1, ensuring gradients can flow " +
      "unimpeded through the network regardless of depth.",
  },

  {
    id: "ml-005",
    type: "knowledge",
    category: "ml-theory",
    categoryLabel: "ML Theory",
    difficulty: "standard",
    title: "KL Divergence Properties",
    tags: ["kl-divergence", "information-theory", "probability", "distributions"],
    question: "Which of the following statements about KL divergence D_KL(P || Q) is TRUE?",
    format: "multiple-choice",
    options: [
      "A) KL divergence is symmetric: D_KL(P || Q) = D_KL(Q || P).",
      "B) KL divergence can be negative when P and Q are very similar.",
      "C) D_KL(P || Q) is non-negative and equals zero if and only if P = Q almost everywhere. It is asymmetric in general.",
      "D) KL divergence satisfies the triangle inequality, making it a valid distance metric.",
    ],
    correctAnswer: "C",
    explanation:
      "KL divergence D_KL(P || Q) = sum(P(x) * log(P(x)/Q(x))) has several important properties: " +
      "(1) Non-negativity (Gibbs' inequality): D_KL(P || Q) >= 0 for all P, Q. " +
      "(2) D_KL(P || Q) = 0 if and only if P = Q almost everywhere. " +
      "(3) Asymmetry: D_KL(P || Q) != D_KL(Q || P) in general. This means it is NOT a true distance metric. " +
      "(4) It does NOT satisfy the triangle inequality. " +
      "The asymmetry has practical implications: minimizing D_KL(P || Q) (forward KL) is mode-covering (Q tries to cover " +
      "all of P's mass), while minimizing D_KL(Q || P) (reverse KL) is mode-seeking (Q concentrates on P's highest modes). " +
      "VAEs use forward KL, while policy optimization often uses reverse KL.",
  },

  {
    id: "ml-006",
    type: "knowledge",
    category: "ml-theory",
    categoryLabel: "ML Theory",
    difficulty: "standard",
    title: "Learning Rate Schedules",
    tags: ["optimization", "learning-rate", "training", "hyperparameters"],
    question:
      "Compare cosine annealing, linear warmup, and step decay learning rate schedules. " +
      "When would you choose each, and why is warmup often used at the start of training?",
    format: "short-answer",
    options: null,
    correctAnswer:
      "Cosine annealing smoothly decreases the learning rate following a cosine curve from the initial LR to near zero, " +
      "providing a gradual transition that often yields strong final performance. Step decay multiplies the LR by a factor " +
      "(e.g., 0.1) at fixed epochs, creating abrupt drops that can cause training instability at transition points but are " +
      "simple to tune. Linear warmup gradually increases the LR from near-zero to the target LR over the first few " +
      "hundred/thousand steps. Warmup is important because: (1) early gradients are computed on random/untrained " +
      "representations and can be noisy or large, (2) adaptive optimizers like Adam need steps to build accurate moment " +
      "estimates, and (3) for large batch training, warmup prevents divergence. Modern practice typically combines warmup " +
      "with cosine annealing (warmup-then-cosine).",
    explanation:
      "Learning rate schedules control the exploration-exploitation tradeoff during optimization. High LRs enable escaping " +
      "local minima but cause instability near convergence; low LRs give fine-grained convergence but can get stuck. " +
      "Cosine annealing is popular in transformer training (used in GPT, LLaMA) because the smooth curve avoids the shock " +
      "of step decay transitions. Warmup has become nearly universal for transformer training, with the typical recipe being " +
      "linear warmup for 1-5% of total steps followed by cosine decay. Step decay remains common in computer vision " +
      "(ResNet-style training) but is increasingly replaced by cosine schedules. Cyclic learning rates and " +
      "one-cycle policies are variants that can speed up convergence.",
  },

  // ─── Open-Ended Questions ──────────────────────────────────────────
  {
    id: "ml-007",
    type: "open-ended",
    category: "ml-theory",
    categoryLabel: "ML Theory",
    difficulty: "standard",
    title: "Offline Evaluation Experiment Plan",
    tags: ["evaluation", "experiment-design", "metrics", "ml-systems"],
    question:
      "You have trained a new ranking model for a search engine. Before deploying it to production, " +
      "you need to design an offline evaluation plan. Describe your approach, including the metrics you would use, " +
      "how you would construct the evaluation dataset, and what pitfalls to watch out for.",
    context:
      "The current production model is a gradient-boosted tree trained on click data. The new model is a " +
      "transformer-based cross-encoder. The search engine serves 10M queries/day across diverse intent types " +
      "(navigational, informational, transactional).",
    rubric: [
      "Selects appropriate ranking metrics (NDCG, MRR, MAP) with justification for each",
      "Addresses evaluation dataset construction: representative query sampling, human relevance judgments, stratification by query type",
      "Identifies position bias in click data and proposes mitigation (e.g., inverse propensity weighting, interleaving)",
      "Considers segment-level analysis beyond aggregate metrics (by query type, frequency, length)",
      "Discusses statistical significance testing (bootstrap confidence intervals, paired tests)",
      "Acknowledges offline-online gap and proposes follow-up online experiments (A/B testing)",
    ],
    sampleAnswer:
      "I would design the evaluation in three phases:\n\n" +
      "1. **Metric Selection**: Use NDCG@10 as the primary metric (handles graded relevance and is position-aware), " +
      "MRR for navigational queries (where finding the single right result matters), and MAP for informational queries. " +
      "Also track recall@k to ensure coverage.\n\n" +
      "2. **Evaluation Dataset**: Sample 10K-50K queries stratified by type (navigational/informational/transactional), " +
      "frequency (head/torso/tail), and topic diversity. Collect human relevance judgments on a 4-point scale (perfect/" +
      "excellent/fair/irrelevant) from trained annotators, with 3+ judges per query-document pair for reliability. " +
      "Do NOT rely solely on click data due to position bias (users click higher-ranked results regardless of relevance).\n\n" +
      "3. **Analysis**: Compute metrics with bootstrap 95% CIs. Perform stratified analysis by query segment. " +
      "Test significance with paired bootstrap or Wilcoxon signed-rank tests. Check for regressions on any segment " +
      "even if aggregate metrics improve. Watch for: (a) overfitting to click patterns that encode position bias, " +
      "(b) tail query degradation since the new model may overfit to head queries, (c) latency differences between " +
      "GBT and cross-encoder affecting the practical candidate set.\n\n" +
      "Follow up with an online A/B test using interleaving (Team Draft) for sensitive ranking comparison.",
    keyPoints: [
      "Position bias in click data makes raw clicks unreliable as ground truth",
      "Stratified evaluation prevents head-query dominance in aggregate metrics",
      "Human relevance judgments are the gold standard for offline ranking evaluation",
      "Statistical significance is essential to avoid acting on noise",
      "Offline metrics don't capture latency, user satisfaction, or engagement effects",
      "Segment-level regression analysis is as important as aggregate improvement",
    ],
  },

  {
    id: "ml-008",
    type: "open-ended",
    category: "ml-theory",
    categoryLabel: "ML Theory",
    difficulty: "stretch",
    title: "Training Instability Diagnosis",
    tags: ["debugging", "training", "optimization", "transformers"],
    question:
      "You are training a 7B-parameter transformer language model. After 20K steps of stable training, " +
      "the loss suddenly spikes and does not recover. Walk through your debugging process: what would you " +
      "investigate, what are the most likely causes, and how would you fix each?",
    context:
      "Training setup: AdamW optimizer, cosine LR schedule with warmup, bf16 mixed precision, " +
      "data-parallel training across 64 GPUs, batch size 4M tokens, max LR 3e-4. The loss was decreasing " +
      "smoothly from 3.2 to 2.8 before the spike. After the spike, loss oscillates around 4.5.",
    rubric: [
      "Checks gradient norms and identifies potential gradient explosion",
      "Investigates data quality at the spike point (corrupted batch, encoding issues, toxic/anomalous data)",
      "Considers learning rate being too high at that point in the schedule",
      "Examines numerical precision issues (bf16 underflow/overflow, loss scaling)",
      "Proposes concrete fixes: gradient clipping, LR reduction, data filtering, checkpointing strategy",
      "Discusses systematic approach: reproduce from checkpoint, binary search for problematic data",
    ],
    sampleAnswer:
      "My debugging process would proceed systematically:\n\n" +
      "**Step 1 - Immediate Investigation**:\n" +
      "- Plot gradient norm history. A sudden spike in gradient norms just before the loss spike confirms gradient explosion.\n" +
      "- Check if the spike is reproducible from the last checkpoint (deterministic vs. stochastic cause).\n" +
      "- Inspect the specific data batches around step 20K for anomalies (very long sequences, unusual token distributions, " +
      "corrupted data, data from a new domain in the shuffle).\n\n" +
      "**Step 2 - Most Likely Causes**:\n" +
      "(a) **Bad data batch**: A batch with anomalous content (e.g., very repetitive tokens, encoding errors, extremely long " +
      "sequences) can produce outsized gradients. Fix: filter data, add sequence-level loss spike detection.\n" +
      "(b) **Gradient explosion without clipping**: If gradient clipping is absent or the clip threshold is too high, a single " +
      "large gradient can corrupt the optimizer state (Adam's moment estimates). Fix: add/tighten gradient clipping (max norm 1.0).\n" +
      "(c) **Learning rate too high**: At 20K steps with cosine schedule, the LR may still be near its peak. Fix: lower max LR or " +
      "extend warmup.\n" +
      "(d) **Numerical issues in bf16**: bf16 has limited dynamic range (max ~3.4e38). Attention logits can exceed this, causing " +
      "inf/NaN that propagate. Fix: compute attention in fp32, add attention logit capping.\n" +
      "(e) **Adam optimizer state corruption**: Once the loss spikes, Adam's variance estimate gets corrupted by the large gradients, " +
      "preventing recovery even after the bad batch passes. Fix: roll back to a pre-spike checkpoint.\n\n" +
      "**Step 3 - Recovery**:\n" +
      "Roll back to step 19.5K checkpoint. Apply gradient clipping (max norm 1.0) if not already present. Skip or filter the " +
      "problematic data. Resume training. If the issue recurs, lower the learning rate by 2-3x.\n\n" +
      "**Step 4 - Prevention**:\n" +
      "Add monitoring for gradient norms, loss spikes, and activation magnitudes. Implement z-loss regularization. " +
      "Save checkpoints every 1K steps. Add automatic rollback on loss spike detection.",
    keyPoints: [
      "Gradient explosion is the most common proximate cause of loss spikes",
      "Bad data batches are a frequent root cause and should be investigated first",
      "Adam optimizer state corruption explains why loss doesn't self-recover after a spike",
      "Rolling back to a pre-spike checkpoint is often the fastest path to recovery",
      "bf16 numerical precision can cause issues in attention computation",
      "Prevention requires monitoring infrastructure: gradient norms, loss spike detection, frequent checkpoints",
      "z-loss regularization and attention logit capping are proven techniques from large-scale training (PaLM, etc.)",
    ],
  },
];

export default mlTheory;
