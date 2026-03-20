const mlSystemDesign = [
  // ─── Coding Questions ─────────────────────────────────────────────────
  {
    id: "msd-001",
    type: "coding",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "Standard",
    title: "Distributed Sampler",
    tags: ["distributed-training", "data-loading", "pytorch"],
    question:
      "Implement a `DistributedSampler` class that partitions a dataset into non-overlapping batches across multiple ranks for distributed training. Given a dataset size, world size (number of ranks), and rank index, the sampler should yield indices belonging only to that rank. Handle the case where the dataset size is not evenly divisible by the world size by padding with repeated indices so every rank gets the same number of samples.",
    hint: "Use modular arithmetic or slicing with a step equal to world_size. For padding, you can extend the index list by wrapping around to the beginning.",
    starterCode: `import math

class DistributedSampler:
    def __init__(self, dataset_size: int, world_size: int, rank: int, shuffle: bool = False, seed: int = 0):
        """
        Args:
            dataset_size: Total number of samples in the dataset.
            world_size: Number of distributed processes / ranks.
            rank: Index of the current process (0-indexed).
            shuffle: Whether to shuffle indices each epoch.
            seed: Random seed for reproducibility when shuffling.
        """
        # TODO: Implement initialization
        pass

    def __iter__(self):
        # TODO: Yield indices for this rank
        pass

    def __len__(self):
        # TODO: Return the number of samples for this rank
        pass

    def set_epoch(self, epoch: int):
        # TODO: Update epoch for shuffling
        pass
`,
    solution: `import math
import torch

class DistributedSampler:
    def __init__(self, dataset_size: int, world_size: int, rank: int, shuffle: bool = False, seed: int = 0):
        self.dataset_size = dataset_size
        self.world_size = world_size
        self.rank = rank
        self.shuffle = shuffle
        self.seed = seed
        self.epoch = 0
        # Pad so every rank gets the same number of samples
        self.num_samples = math.ceil(dataset_size / world_size)
        self.total_size = self.num_samples * world_size

    def __iter__(self):
        if self.shuffle:
            g = torch.Generator()
            g.manual_seed(self.seed + self.epoch)
            indices = torch.randperm(self.dataset_size, generator=g).tolist()
        else:
            indices = list(range(self.dataset_size))

        # Pad by wrapping around
        padding_size = self.total_size - len(indices)
        indices += indices[:padding_size]

        # Subsample for this rank
        indices = indices[self.rank:self.total_size:self.world_size]
        assert len(indices) == self.num_samples
        return iter(indices)

    def __len__(self):
        return self.num_samples

    def set_epoch(self, epoch: int):
        self.epoch = epoch
`,
    explanation:
      "The key idea is that each rank takes every world_size-th element starting from its own rank index. When the dataset size is not evenly divisible, we pad with wrapped indices so every rank processes the same number of samples per epoch, which is critical for synchronized distributed training with AllReduce.",
    testCases: [
      "sampler = DistributedSampler(10, 3, 0); assert len(sampler) == 4",
      "sampler = DistributedSampler(10, 3, 0); indices = list(sampler); assert len(indices) == 4",
      "all_indices = []; [all_indices.extend(list(DistributedSampler(10, 3, r))) for r in range(3)]; assert len(all_indices) == 12",
      "s = DistributedSampler(8, 2, 0); assert list(s) == [0, 2, 4, 6]",
      "s = DistributedSampler(8, 2, 1); assert list(s) == [1, 3, 5, 7]",
    ],
    timeComplexity: "O(N) where N is the dataset size",
    spaceComplexity: "O(N) to store the full index list before slicing",
  },
  {
    id: "msd-002",
    type: "coding",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "Standard",
    title: "Gradient Accumulation with Mixed Precision",
    tags: ["gradient-accumulation", "mixed-precision", "pytorch", "amp"],
    question:
      "Implement a training loop function that combines gradient accumulation with mixed precision training (AMP). The function should accumulate gradients over `accumulation_steps` micro-batches before performing a single optimizer step. Use `torch.cuda.amp.autocast` for forward passes and `GradScaler` for stable FP16 training. Make sure to correctly scale the loss by the number of accumulation steps.",
    hint: "Divide the loss by accumulation_steps before calling backward. Only call optimizer.step(), scaler.update(), and optimizer.zero_grad() after accumulating all micro-batches. Wrap only the forward pass and loss computation in autocast, not the backward pass.",
    starterCode: `import torch
from torch.cuda.amp import autocast, GradScaler

def train_step_with_accumulation(model, data_loader, optimizer, loss_fn, accumulation_steps=4, device="cuda"):
    """
    Perform one full optimizer step with gradient accumulation and mixed precision.

    Args:
        model: PyTorch model.
        data_loader: Iterable yielding (inputs, targets) batches.
        optimizer: Optimizer instance.
        loss_fn: Loss function.
        accumulation_steps: Number of micro-batches to accumulate.
        device: Device string.

    Returns:
        Average loss over the accumulated micro-batches.
    """
    scaler = GradScaler()
    # TODO: Implement gradient accumulation with mixed precision
    pass
`,
    solution: `import torch
from torch.cuda.amp import autocast, GradScaler

def train_step_with_accumulation(model, data_loader, optimizer, loss_fn, accumulation_steps=4, device="cuda"):
    scaler = GradScaler()
    model.train()
    optimizer.zero_grad()

    total_loss = 0.0
    data_iter = iter(data_loader)

    for step in range(accumulation_steps):
        inputs, targets = next(data_iter)
        inputs, targets = inputs.to(device), targets.to(device)

        with autocast():
            outputs = model(inputs)
            loss = loss_fn(outputs, targets)
            # Scale loss by accumulation steps to get correct average gradient
            loss = loss / accumulation_steps

        # Scale loss and call backward (outside autocast)
        scaler.scale(loss).backward()
        total_loss += loss.item()

    # Unscale before clipping (optional but recommended)
    scaler.unscale_(optimizer)
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

    # Step optimizer and update scaler
    scaler.step(optimizer)
    scaler.update()
    optimizer.zero_grad()

    return total_loss
`,
    explanation:
      "Gradient accumulation simulates larger batch sizes by summing gradients over multiple micro-batches before updating weights. Dividing the loss by accumulation_steps ensures the accumulated gradient is equivalent to a single large-batch gradient. Mixed precision (autocast) runs the forward pass in FP16 for speed, while GradScaler prevents underflow during FP16 backward passes by dynamically scaling the loss. The backward pass itself should NOT be inside autocast. scaler.unscale_() is called before gradient clipping to operate on the true gradient magnitudes.",
    testCases: [
      "# Conceptual test: function returns a float loss value",
      "# After accumulation_steps micro-batches, optimizer.step() is called exactly once",
      "# Loss is divided by accumulation_steps before backward",
      "# autocast wraps only the forward pass, not backward",
    ],
    timeComplexity: "O(accumulation_steps * forward_pass_cost)",
    spaceComplexity: "O(model_params) — gradients are accumulated in-place, no extra copies per step",
  },

  // ─── Knowledge Questions ──────────────────────────────────────────────
  {
    id: "msd-003",
    type: "knowledge",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "Core",
    title: "Data Parallel vs Model Parallel vs Pipeline Parallel",
    tags: ["distributed-training", "parallelism", "scaling"],
    question:
      "You are training a 30B parameter model on 64 GPUs. The model fits in a single GPU's memory but training is too slow. Which parallelism strategy would you use FIRST to speed up training?",
    format: "multiple-choice",
    options: [
      "A) Model parallelism — split the model layers across GPUs",
      "B) Data parallelism — replicate the model on each GPU and split the data",
      "C) Pipeline parallelism — split the model into stages across GPUs",
      "D) Tensor parallelism — split individual layer computations across GPUs",
    ],
    correctAnswer: "B",
    explanation:
      "When the model fits in a single GPU's memory, data parallelism (DP) is the simplest and most efficient strategy. Each GPU holds a full model replica and processes a different data shard; gradients are synchronized via AllReduce. DP has near-linear scaling and minimal communication overhead compared to model or pipeline parallelism. Model parallelism (splitting layers) and tensor parallelism (splitting operations within layers) introduce significant inter-GPU communication for activations and are only necessary when the model does NOT fit on a single GPU. Pipeline parallelism helps with memory but introduces bubble overhead and is also unnecessary if the model already fits.",
  },
  {
    id: "msd-004",
    type: "knowledge",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "Standard",
    title: "FSDP/ZeRO Stages",
    tags: ["FSDP", "ZeRO", "deepspeed", "memory-optimization"],
    question:
      "Explain the three stages of ZeRO (Zero Redundancy Optimizer) and the tradeoff each stage makes between memory savings and communication overhead.",
    format: "short-answer",
    options: null,
    correctAnswer:
      "Stage 1: Partition optimizer states across ranks. Each rank stores only 1/N of the optimizer states (e.g., Adam momentum and variance). Minimal extra communication — only an AllGather of parameters after the optimizer step. Stage 2: Partition optimizer states AND gradients. Gradients are reduced via ReduceScatter instead of AllReduce, so each rank only stores its shard of gradients. Communication is roughly equivalent to Stage 1 since ReduceScatter replaces AllReduce. Stage 3: Partition optimizer states, gradients, AND model parameters. Each rank stores only 1/N of everything. Requires an AllGather of parameters before each forward and backward pass, significantly increasing communication volume (roughly 1.5x the communication of Stage 1/2). The tradeoff: Stage 1 saves ~4x memory with almost no communication cost. Stage 2 saves ~8x with similar communication. Stage 3 saves up to ~N× but at the cost of substantially higher communication, making it suitable only when the model cannot fit using Stage 1 or 2.",
    explanation:
      "ZeRO (used in DeepSpeed and PyTorch FSDP) eliminates memory redundancy in data-parallel training. In standard DDP, every rank stores a full copy of parameters, gradients, and optimizer states. ZeRO progressively shards these across ranks. The key insight is that each rank only needs the full parameters during forward/backward computation — the rest of the time, sharded storage suffices. FSDP (Fully Sharded Data Parallel) in PyTorch is essentially ZeRO Stage 3.",
  },
  {
    id: "msd-005",
    type: "knowledge",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "Standard",
    title: "Activation Checkpointing Tradeoffs",
    tags: ["activation-checkpointing", "memory-optimization", "compute-tradeoff"],
    question:
      "Activation checkpointing (gradient checkpointing) reduces memory usage during training. What is the primary tradeoff?",
    format: "multiple-choice",
    options: [
      "A) It reduces memory by ~50% but increases training time by ~100% due to full recomputation",
      "B) It reduces peak activation memory from O(N) to O(sqrt(N)) layers but adds ~33% extra compute from recomputing activations during the backward pass",
      "C) It reduces memory but requires twice as many GPUs to maintain throughput",
      "D) It reduces memory by offloading activations to CPU, adding PCIe transfer latency",
    ],
    correctAnswer: "B",
    explanation:
      "Activation checkpointing saves only a subset of activations during the forward pass (typically at checkpoint boundaries) and recomputes the discarded activations during the backward pass. With optimal placement (every sqrt(N) layers), peak activation memory drops from O(N) to O(sqrt(N)). The cost is roughly one extra forward pass through the non-checkpointed segments, adding approximately 33% compute overhead (since the backward pass already costs ~2x the forward pass, adding 1x forward recomputation increases total from 3x to 4x per iteration). It does NOT offload to CPU (that is a separate technique called CPU offloading) and does not require additional GPUs.",
  },

  // ─── Open-Ended Questions ─────────────────────────────────────────────
  {
    id: "msd-006",
    type: "open-ended",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "Stretch",
    title: "End-to-End Distributed Training System",
    tags: ["system-design", "distributed-training", "infrastructure"],
    question:
      "Design an end-to-end distributed training infrastructure for training a 70B parameter LLM from scratch. Cover hardware selection, parallelism strategy, fault tolerance, data pipeline, checkpointing, and monitoring. Assume a budget for up to 512 GPUs.",
    context:
      "This is a full ML system design question similar to what you might encounter at a frontier AI lab. You should think about all layers of the stack, from hardware to training loop to observability.",
    rubric: [
      "Hardware & Networking: Selects appropriate GPU (A100/H100 80GB), discusses NVLink/NVSwitch for intra-node and InfiniBand/RoCE for inter-node communication",
      "Parallelism Strategy: Combines DP + TP + PP (3D parallelism); justifies TP degree (e.g., 8 within a node) and PP stages; mentions FSDP/ZeRO as alternative",
      "Data Pipeline: Discusses tokenized data sharding, streaming from distributed storage, prefetching to avoid GPU starvation, data deduplication",
      "Checkpointing: Async distributed checkpointing, frequency trade-offs, mentions tools like torch.distributed.checkpoint or Nebula",
      "Fault Tolerance: Elastic training, automatic restart from checkpoint, health monitoring, handling stragglers and slow nodes",
      "Monitoring & Debugging: Loss curves, gradient norms, learning rate schedules, per-GPU utilization, MFU tracking, detecting training instabilities",
    ],
    sampleAnswer:
      "Hardware: 64 nodes of 8xH100-80GB each (512 GPUs total) connected via NVLink within nodes and 400Gbps InfiniBand across nodes. Parallelism: Use 3D parallelism — tensor parallelism degree 8 (within each node to leverage NVLink), pipeline parallelism degree 8 (across 8 nodes per pipeline), and data parallelism degree 8 (8 pipeline replicas). This gives 8 × 8 × 8 = 512 GPUs. Use interleaved 1F1B pipeline schedule to minimize bubble overhead. Data Pipeline: Pre-tokenize data and store in sharded binary format on a distributed filesystem (e.g., Lustre or S3). Each DP rank reads its own shard with prefetching. Use a streaming dataloader to avoid loading full dataset into memory. Checkpointing: Save distributed checkpoints every 500-1000 steps using async checkpointing to avoid stalling training. Use torch.distributed.checkpoint for sharded saves — each rank saves its own shard in parallel. Keep last 3 checkpoints and one per 10k steps. Fault Tolerance: Implement elastic training with automatic restarts. Use a job scheduler (SLURM) with preemption handling. Monitor node health and automatically exclude failed nodes, redistributing work. Detect stragglers via step-time monitoring and flag anomalous nodes. Monitoring: Track loss, gradient norms (watch for spikes), learning rate, tokens/sec, MFU (target >50%), GPU memory utilization, and inter-node communication bandwidth. Set up alerts for loss spikes, NaN gradients, and GPU failures. Use tools like Weights & Biases for experiment tracking.",
    keyPoints: [
      "3D parallelism (TP + PP + DP) is standard for large-scale LLM training",
      "TP should be within a node (NVLink) since it has the highest communication volume",
      "Async distributed checkpointing prevents training stalls",
      "Fault tolerance is critical at scale — expect hardware failures during multi-week training runs",
      "MFU (Model FLOPs Utilization) is the key efficiency metric, typically 40-60% for large runs",
      "Data pipeline must not be the bottleneck — use pre-tokenized, pre-sharded data with prefetching",
    ],
  },
  {
    id: "msd-007",
    type: "open-ended",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "Standard",
    title: "GPU Memory Budget for 70B Model on 8xA100",
    tags: ["memory-estimation", "sharding", "gpu-memory"],
    question:
      "You need to fine-tune a 70B parameter LLM on a single node with 8xA100-80GB GPUs. Walk through the memory calculation and propose a sharding/parallelism strategy that makes this feasible.",
    context:
      "This is a quantitative reasoning question. You should estimate memory for parameters, gradients, optimizer states, and activations, then show how your chosen strategy fits within the available memory.",
    rubric: [
      "Parameter Memory: Correctly calculates ~140GB for 70B params in FP16/BF16 (2 bytes each)",
      "Optimizer Memory: Correctly estimates Adam optimizer states at ~4x parameter memory in FP32 (momentum + variance + master weights) = ~560GB",
      "Gradient Memory: ~140GB in FP16",
      "Activation Memory: Acknowledges it depends on batch size and sequence length; provides reasonable estimate",
      "Total Memory: ~840GB+ before activations, clearly exceeding 8×80GB = 640GB without sharding",
      "Strategy: Proposes FSDP (ZeRO Stage 3) or 3D parallelism; discusses activation checkpointing and/or LoRA as alternatives; shows how chosen strategy fits in memory",
    ],
    sampleAnswer:
      "Memory Breakdown: Parameters: 70B × 2 bytes (BF16) = 140GB. Optimizer states (Adam): master weights (FP32, 280GB) + momentum (FP32, 280GB) + variance (FP32, 280GB) = 840GB. Gradients: 70B × 2 bytes = 140GB. Total (excluding activations): 140 + 840 + 140 = 1,120GB. Available: 8 × 80GB = 640GB. This clearly does not fit even without activations. Strategy: Use FSDP (ZeRO Stage 3) to shard parameters, gradients, and optimizer states across all 8 GPUs. Per-GPU memory: 1,120GB / 8 = 140GB — still exceeds 80GB. So we additionally need: (1) Activation checkpointing to reduce activation memory to near-zero overhead. (2) Mixed precision training so optimizer states use fewer bytes where possible. (3) Consider LoRA or QLoRA for fine-tuning: freeze most parameters and train low-rank adapters, reducing trainable params from 70B to ~100M-1B, which drastically cuts optimizer state and gradient memory. With QLoRA: load base model in 4-bit (70B × 0.5 bytes = 35GB, ~4.4GB/GPU), train only LoRA adapters (negligible memory), total fits comfortably. Full fine-tuning at this scale typically requires 16+ GPUs or CPU offloading (ZeRO-Offload).",
    keyPoints: [
      "70B params in BF16 = 140GB just for parameters",
      "Adam optimizer states are the dominant memory cost (~3-4x parameter size in FP32)",
      "FSDP/ZeRO Stage 3 shards everything but 640GB total is still tight for full fine-tuning",
      "Activation checkpointing is essentially mandatory at this scale",
      "LoRA/QLoRA is the practical answer for fine-tuning on limited hardware",
      "CPU offloading (ZeRO-Offload) is an option but significantly impacts throughput",
    ],
  },
  {
    id: "msd-008",
    type: "open-ended",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "Standard",
    title: "Personalized News Ranking System",
    tags: ["ranking", "recommendation", "system-design", "meta-style"],
    question:
      "Design a personalized news feed ranking system for a social media platform with 2 billion users. Walk through the end-to-end ML system: data collection, feature engineering, model architecture, training pipeline, serving infrastructure, and evaluation.",
    context:
      "This is a Meta-style ML system design question. The focus is on the full ML system, not just the model. Think about scale, latency requirements, and real-world constraints like cold-start and content freshness.",
    rubric: [
      "Problem Framing: Defines the ranking objective (e.g., maximize meaningful engagement, not just clicks); discusses multi-objective optimization (engagement, quality, diversity)",
      "Data & Features: Identifies key feature categories — user features, item features, context features, user-item interaction features; discusses feature freshness and real-time signals",
      "Model Architecture: Proposes a multi-stage funnel (candidate generation → ranking → re-ranking); describes a two-tower or late-interaction architecture for the ranker",
      "Training Pipeline: Discusses online vs offline training, label definition (implicit feedback like clicks/dwell time), handling position bias, negative sampling strategy",
      "Serving: Addresses latency requirements (<200ms), caching strategies, feature store architecture, model serving infrastructure (batched inference, model sharding for large models)",
      "Evaluation: Covers offline metrics (NDCG, AUC), online A/B testing, guardrail metrics (e.g., reducing misinformation, click-bait), long-term user retention metrics",
    ],
    sampleAnswer:
      "Problem Framing: Rank candidate posts to maximize long-term user engagement quality. Optimize a weighted combination of P(click), P(long_dwell | click), P(like), P(share), P(comment), with negative weights for P(hide) and P(report). This avoids optimizing for clickbait. Architecture: Three-stage funnel: (1) Candidate Generation: Use lightweight models (two-tower with user/item embeddings) to retrieve ~1000 candidates from millions of eligible posts. Combine multiple sources: friends' posts, group posts, trending content, ads. (2) Main Ranker: A deep model (e.g., DCN-v2 or multi-task MMOE) that scores each candidate with full features. Inputs include dense features (user history embeddings, post embeddings), sparse features (user ID, author ID, content type), real-time features (time since post, current session behavior). Predicts multiple engagement targets simultaneously. (3) Re-ranking: Apply business rules, diversity injection (avoid showing 5 posts from the same friend), content policy filters, and explore/exploit for new content. Features: User features (demographics, historical engagement patterns, social graph embedding), Post features (content embedding from a separate NLP/vision model, author features, engagement statistics), Context features (time of day, device, network speed), Cross features (user-author affinity, user-topic affinity). Use a feature store with both batch-computed features (updated hourly) and real-time features (last 5 minutes of interactions). Training: Train on logged interaction data with multi-task learning. Use importance weighting to correct for position bias. Retrain daily on fresh data; update embeddings more frequently. Use a large-scale distributed training setup with data parallelism. Serving: Pre-compute and cache candidate sets; score with the ranker at request time. Serve the ranker on GPUs with batched inference. Feature lookup from an in-memory feature store (Redis/Memcached). Target p99 latency: 150ms for the full ranking pipeline. Evaluation: Offline — track NDCG@10, AUC for each engagement type, calibration. Online — run A/B tests measuring sessions per user, time spent, content diversity consumed, user retention at 7/28 days. Guardrails — monitor misinformation spread rate, hate speech exposure, filter bubble metrics.",
    keyPoints: [
      "Multi-stage funnel (candidate gen → ranker → re-ranker) is essential at billion-user scale",
      "Multi-objective optimization avoids optimizing for shallow engagement",
      "Real-time features (recent interactions) are critical for feed freshness",
      "Position bias correction is necessary when training on logged data",
      "Feature stores with both batch and real-time pipelines are standard",
      "A/B testing with guardrail metrics prevents optimizing engagement at the cost of user well-being",
    ],
  },
];

export default mlSystemDesign;
