const mlSystemDesign = [
  // ─── Coding Questions ─────────────────────────────────────────────────
  {
    id: "msd-001",
    type: "coding",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "standard",
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
    difficulty: "standard",
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
    difficulty: "core",
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
    difficulty: "standard",
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
    difficulty: "standard",
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
    difficulty: "stretch",
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
    difficulty: "standard",
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
    difficulty: "standard",
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
  {
    id: "msd-009",
    type: "open-ended",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "standard",
    title: "RAG Pipeline Design",
    tags: ["rag", "retrieval", "vector-db", "embeddings", "reranking"],
    question:
      "Design an end-to-end Retrieval-Augmented Generation (RAG) pipeline. Cover document ingestion and preprocessing, chunking strategies, embedding model selection, vector database choice, retrieval with reranking, and final generation with inline citations.",
    context:
      "You are building a RAG system for an enterprise knowledge base with ~500K documents (PDFs, HTML, markdown). Users ask natural-language questions and expect accurate, cited answers. The system must handle documents up to 100 pages long and support multilingual queries.",
    rubric: [
      "Ingestion & Preprocessing: Describes document parsing (PDF, HTML, markdown), text extraction, deduplication, and metadata extraction (source, date, author)",
      "Chunking Strategy: Discusses fixed-size vs. semantic chunking, overlap strategy, handling tables/figures, and the tradeoff between chunk size and retrieval precision",
      "Embedding Model: Justifies model selection (size, multilingual support, domain), discusses batch encoding and index updates for new documents",
      "Vector DB: Selects an appropriate vector store (Pinecone, Weaviate, pgvector, etc.) and discusses indexing (HNSW vs. IVF), filtering by metadata, and scale",
      "Retrieval + Reranking: Describes hybrid search (dense + sparse BM25), top-k retrieval, and a cross-encoder reranker for precision",
      "Generation with Citations: Explains context assembly, prompt design with source grounding, and citation injection into the response",
      "Failure modes: Handles out-of-domain queries, hallucination mitigation, stale documents, and query routing",
    ],
    sampleAnswer:
      "Ingestion: A document ingestion service parses raw files using libraries like PyMuPDF (PDF), BeautifulSoup (HTML), and mistune (markdown). Each parsed document is stored with metadata (source_url, doc_id, ingestion_ts, language). Deduplication uses a content hash at the document level.\n\nChunking: Use recursive character splitting with a 512-token target chunk size and 50-token overlap. For structured content (tables, code), use semantic chunking that respects element boundaries. Smaller chunks improve retrieval precision but increase index size; 512 tokens is a common sweet spot for factual Q&A. Store the parent document ID with each chunk for citation assembly.\n\nEmbedding: Use a multilingual sentence-transformers model (e.g., intfloat/multilingual-e5-large) to handle multilingual queries. Encode chunks in batches on GPU. On document update, re-encode only affected chunks and upsert them into the vector store.\n\nVector DB: Use Weaviate or pgvector (for existing Postgres infra). Index with HNSW for sub-millisecond ANN search. Store metadata fields as filterable properties to support date-range and source filters. For 500K documents at ~5 chunks each = 2.5M vectors at 1024 dims — easily handled by most vector stores.\n\nRetrieval + Reranking: Hybrid search: run dense ANN retrieval (top-50) in parallel with sparse BM25 keyword search (top-50), then merge and deduplicate. Pass the ~50 candidates through a cross-encoder reranker (e.g., cross-encoder/ms-marco-MiniLM-L-6-v2) to produce a final top-5 to top-10 context set. The cross-encoder is slower but dramatically improves precision by scoring query-chunk pairs jointly.\n\nGeneration: Assemble the top-k chunks into a context window with source markers. Use a structured prompt: 'Answer based only on the provided context. For each claim, cite the source using [Source N] notation. If the answer cannot be found in the context, say so explicitly.' This grounds the LLM output and enables hallucination detection (if the model cites a source that doesn't support the claim). Return inline citations with document ID, title, and page number.\n\nFailure Modes: Out-of-domain: if top retrieval scores are below a threshold, return a 'not found in knowledge base' response rather than hallucinating. Stale documents: TTL metadata triggers re-ingestion. Query routing: a lightweight classifier determines if a query is factual (route to RAG) vs. conversational (route to standard LLM).",
    keyPoints: [
      "Chunking strategy directly impacts retrieval quality — semantic chunking outperforms fixed-size for structured documents",
      "Hybrid search (dense + sparse) consistently outperforms either alone, especially for keyword-heavy queries",
      "Reranking with a cross-encoder is the highest-ROI improvement over naive top-k retrieval",
      "Citations require storing chunk-to-document mappings at ingestion time, not as an afterthought",
      "Thresholding retrieval scores allows the system to abstain rather than hallucinate",
      "Multilingual support requires an embedding model trained on multilingual data, not just English",
    ],
  },
  {
    id: "msd-010",
    type: "open-ended",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "stretch",
    title: "Inference Batching System Design",
    tags: ["inference", "batching", "gpu", "scheduling", "llm-serving"],
    question:
      "Design a batching and scheduling system for LLM inference at scale. Cover continuous batching, dynamic batch sizing, SLA-aware priority queuing, and GPU memory management. This is Anthropic's most commonly asked ML systems design question.",
    context:
      "You are designing the inference serving layer for a large language model (70B parameters). The system must handle thousands of concurrent requests with varying prompt lengths and generation lengths. You have a fleet of 8xH100 nodes. P50 latency target is 500ms for the first token (TTFT) and 50ms per output token (TBT) for interactive tier; background tier can tolerate 10s TTFT.",
    rubric: [
      "Continuous Batching: Explains how continuous (iteration-level) batching differs from static batching, and why it dramatically improves GPU utilization for variable-length sequences",
      "Dynamic Batch Sizing: Describes how to size batches based on available KV cache memory rather than a fixed batch size parameter",
      "KV Cache Management: Discusses KV cache allocation per sequence, preemption and swapping strategies, and PagedAttention (vLLM's block-based KV cache)",
      "Priority Queuing: Designs a queue with at least two tiers (interactive and background), describes how to implement SLA-aware scheduling (earliest deadline first, etc.)",
      "GPU Memory Budget: Shows how to estimate total KV cache capacity given model size, and how to maximize it",
      "Prefill vs Decode Disaggregation: Discusses separating prefill (compute-bound) and decode (memory-bandwidth-bound) phases onto different hardware or batches",
      "Metrics and Autoscaling: Defines the key serving metrics (TTFT, TBT, throughput, GPU utilization) and how to autoscale the fleet",
    ],
    sampleAnswer:
      "Core Problem: Static batching wastes GPU cycles because sequences finish at different times, leaving slots idle until the whole batch completes. The solution is continuous batching.\n\nContinuous Batching: At every decode iteration, the scheduler can add new sequences to empty slots from completed sequences. This keeps the GPU batch full at all times. The batch size varies dynamically between iterations. The key scheduler decision is: which sequences to add/remove at each step.\n\nKV Cache Management with PagedAttention: Traditional KV cache pre-allocates a contiguous block per sequence of size max_seq_len, which wastes memory for shorter sequences. PagedAttention (vLLM) manages KV cache in fixed-size pages (blocks) like OS virtual memory. Each sequence gets pages allocated on-demand; pages from completed sequences are immediately reclaimed. This reduces KV cache fragmentation dramatically and allows more sequences to run concurrently.\n\nDynamic Batch Sizing: Instead of a fixed batch size, maintain a target KV cache utilization (e.g., 90%). At each scheduling step, compute available KV cache pages and admit new sequences until pages are exhausted. When memory pressure is high, use preemption: swap the KV cache of low-priority sequences to CPU RAM or recompute prefill (restart the sequence) to free GPU memory for higher-priority requests.\n\nPriority Queuing: Maintain two queues — interactive (SLA: 500ms TTFT) and background (SLA: 10s TTFT). Schedule with Earliest Deadline First (EDF) within each tier. The interactive queue preempts background sequences when GPU memory is constrained. Assign deadlines at enqueue time: deadline = arrival_time + TTFT_SLA. For background workloads, use weighted fair queuing to prevent starvation.\n\nPrefill-Decode Disaggregation: Prefill (processing the full prompt) is compute-bound (matrix multiplications over long sequences). Decode (generating one token at a time) is memory-bandwidth-bound (loading all model weights for each token). Disaggregating these onto separate GPU pools allows each to be optimized independently. Prefill nodes can use chunked prefill to interleave with decode and reduce TTFT spikes.\n\nGPU Memory Budget: For a 70B BF16 model: weights = 140GB (2 bytes/param). With 8×80GB H100s = 640GB total. After model weights: 500GB free. KV cache per token per layer: 2 (K+V) × num_heads × head_dim × bytes = 2 × 64 × 128 × 2 = 32KB per layer, × 80 layers = 2.56MB per token. With 500GB free: ~195K tokens of KV cache capacity. At avg sequence length 2K tokens, that supports ~97 concurrent sequences.\n\nMetrics and Autoscaling: Track TTFT p50/p99, TBT p50/p99, throughput (tokens/sec), GPU memory utilization, queue depth per tier. Autoscale by provisioning additional inference nodes when queue depth for interactive tier exceeds a threshold or TTFT p95 > 400ms.",
    keyPoints: [
      "Continuous batching is the single most important optimization for LLM serving throughput",
      "PagedAttention eliminates KV cache fragmentation and enables near-optimal GPU memory utilization",
      "Dynamic batch sizing based on KV cache pages outperforms fixed batch sizes by 2-4x",
      "Prefill-decode disaggregation allows independent optimization of compute-bound and memory-bandwidth-bound phases",
      "Priority queuing with preemption is required to serve mixed interactive + background workloads on shared hardware",
      "TTFT and TBT are the two primary user-facing latency metrics; they require different optimizations",
      "KV cache capacity (not GPU compute) is typically the binding constraint for concurrent sequence count",
    ],
  },
  {
    id: "msd-011",
    type: "open-ended",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "standard",
    title: "LLM Evaluation Framework Design",
    tags: ["evaluation", "metrics", "a-b-testing", "llm-quality"],
    question:
      "Design a comprehensive evaluation framework for a large language model. Cover automated metrics (perplexity, BLEU, ROUGE, etc.), human evaluation pipelines, A/B testing, regression detection, and safety checks. The framework should support both pre-deployment evaluation and continuous post-deployment monitoring.",
    context:
      "Your team ships a general-purpose LLM assistant. The model is fine-tuned and updated frequently. You need an eval framework that catches quality regressions before deployment, measures real-world user satisfaction, and detects safety issues continuously.",
    rubric: [
      "Automated Metrics: Lists appropriate metrics per task type (perplexity for LM quality, ROUGE/BLEU for summarization/translation, exact match for QA, win-rate for generation quality)",
      "LLM-as-Judge: Describes using a strong LLM to score outputs on quality dimensions (helpfulness, coherence, groundedness, safety) as a scalable alternative to human eval",
      "Human Evaluation Pipeline: Describes how to collect high-quality human preference labels at scale (crowdsourcing platform, annotator training, quality control, inter-rater reliability)",
      "A/B Testing: Explains how to run statistically valid online experiments comparing model versions, including power analysis, randomization, and guardrail metrics",
      "Regression Detection: Proposes a mechanism to automatically flag regressions on a golden benchmark set before deployment",
      "Safety Evaluation: Covers adversarial probing, harm category benchmarks, and policy compliance checks",
      "Infrastructure: Describes the data pipelines, storage, dashboards, and alerting needed to operationalize the framework",
    ],
    sampleAnswer:
      "Automated Metrics by Task: Perplexity on held-out data as a general LM health signal. ROUGE-L and BERTScore for summarization. BLEU/COMET for translation. Exact match and F1 for extractive QA. For open-ended generation, automated metrics are insufficient alone — use LLM-as-judge.\n\nLLM-as-Judge: Use a strong judge model (e.g., GPT-4) to evaluate outputs on a 5-point scale across dimensions: helpfulness, factual accuracy, coherence, conciseness, and safety. Run the judge on 1,000-5,000 examples per eval cycle. Validate the judge periodically against human labels for calibration. LLM judges are ~0.8-0.9 correlated with human preference at scale with much lower cost.\n\nHuman Evaluation Pipeline: Use a crowdsourcing platform (Scale AI, Surge) with trained annotators. For preference evaluation, show annotators two model outputs side-by-side (blinded) and ask which is better on each dimension. Compute inter-annotator agreement (Cohen's kappa). Annotators with kappa < 0.6 are retrained or replaced. Use majority vote across 3 annotators per example. Collect ~500-2,000 human preferences per model update for statistically significant win-rate estimates.\n\nA/B Testing: Run online experiments where N% of traffic receives the new model (treatment) and the remaining receives the incumbent (control). Randomize at the user level to avoid session contamination. Primary metric: explicit thumbs up/down rate and implicit satisfaction signals (session length, retry rate). Guardrail metrics: safety violation rate, latency. Use a sequential testing procedure (e.g., mSPRT) to allow early stopping without inflating Type I error. Minimum detectable effect: 1% win-rate with 80% power requires ~20K users per arm.\n\nRegression Detection: Maintain a golden benchmark suite of ~10K examples with known-good reference outputs. Before every deployment, run the new model on the full suite. Block deployment if win-rate vs. reference drops by more than 2% on any category or if any safety benchmark degrades. Track the time-series of each benchmark metric to detect gradual drift.\n\nSafety Evaluation: Run a dedicated safety eval suite covering harm categories (violence, CSAM, self-harm, PII, jailbreaks). Use automated safety classifiers to score model outputs. Run adversarial probing with red-team prompts generated by an attacker LLM. Any regression in safety benchmarks blocks deployment regardless of quality improvements.\n\nInfrastructure: A centralized eval service accepts model endpoints and benchmark IDs, runs evaluations in parallel, and stores results in a time-series database. A dashboard tracks all metrics over time with regression alerts. Results are linked to the model registry so every model version has a full eval report.",
    keyPoints: [
      "No single metric captures LLM quality — use a multi-dimensional eval suite",
      "LLM-as-judge scales human-quality evaluation at machine cost for most quality dimensions",
      "A/B testing requires proper randomization, sufficient power, and guardrail metrics to prevent gaming",
      "A golden benchmark suite is the primary regression gate before deployment",
      "Safety eval must be a hard gate — it cannot be outweighed by quality improvements",
      "Human and automated evals are complementary: automated evals are cheap and fast; human evals are the ground truth",
    ],
  },
  {
    id: "msd-012",
    type: "open-ended",
    category: "ml-system-design",
    categoryLabel: "ML System Design",
    difficulty: "standard",
    title: "Real-Time Feature Store Design",
    tags: ["feature-store", "real-time", "batch", "ml-infrastructure"],
    question:
      "Design a feature store that supports both batch-computed and real-time features, online and offline serving, feature versioning, and historical backfill. The store must serve features at low latency (<10ms p99) for online inference while also providing point-in-time correct features for training data generation.",
    context:
      "Your company runs multiple ML models (fraud detection, recommendations, churn prediction) each needing different feature freshness requirements: fraud needs sub-second features, recommendations need hourly, and churn can tolerate daily. The feature store must serve all three use cases from a single system.",
    rubric: [
      "Dual Store Architecture: Describes separate online store (low latency, KV) and offline store (columnar, point-in-time correct) with a sync layer between them",
      "Batch Feature Pipeline: Describes how batch features (computed daily/hourly in Spark or SQL) are written to both stores",
      "Real-Time Feature Pipeline: Describes streaming computation (Kafka + Flink/Spark Streaming) for sub-second features written to the online store",
      "Online Serving: Describes the online serving path: feature lookup by entity ID from a low-latency KV store (Redis/DynamoDB), feature joining, and serving",
      "Offline Serving: Describes point-in-time correct feature retrieval for training (merge_asof join, preventing data leakage)",
      "Feature Versioning: Explains how to version feature definitions, handle schema evolution, and maintain backward compatibility",
      "Backfill: Describes how to backfill historical feature values when a new feature is added, and the challenge of event-time correctness during backfill",
    ],
    sampleAnswer:
      "Architecture: The feature store has three planes — (1) a compute plane that produces features, (2) an online store for low-latency serving, and (3) an offline store for training data generation.\n\nOnline Store: Redis Cluster (or DynamoDB) stores the latest feature values per entity as a hash map: {entity_id -> {feature_name: value, computed_at: timestamp}}. Lookups are O(1) with p99 < 5ms. Features expire via TTL based on their freshness requirement (fraud: 1 minute, recommendations: 2 hours, churn: 25 hours).\n\nOffline Store: An Apache Iceberg or Delta Lake table partitioned by entity and date. Each row stores {entity_id, feature_name, value, event_ts, created_at}. This enables point-in-time joins: to retrieve features as they existed at a given timestamp, use a merge_asof join on event_ts — the standard technique for training data generation without leakage.\n\nBatch Feature Pipeline: Scheduled Spark or dbt jobs compute aggregate features (e.g., 7-day purchase count) from the data warehouse. Results are written to both the offline store (for historical queries) and the online store (for live serving). A dual-write SDK ensures consistency.\n\nReal-Time Feature Pipeline: A Kafka stream captures raw events (clicks, transactions). A Flink streaming job computes window aggregations (e.g., events in last 5 minutes per user) and writes results to Redis with a short TTL. Real-time features are also written to the offline store with event timestamps for training reproducibility.\n\nFeature Versioning: Feature definitions are stored in a central registry (YAML schemas with semantic versioning). Breaking changes (type changes, aggregation window changes) require a new feature name. Non-breaking changes (description, TTL) are in-place updates. The registry enforces version compatibility checks before deployment. All feature reads include the feature version to detect staleness.\n\nBackfill: When a new feature is added, a backfill job replays historical events to compute the feature at all past timestamps. Backfill uses event-time processing (not processing-time) to ensure correctness. Until backfill is complete, the feature is marked as 'partial' in the registry and training jobs exclude it or use a fallback value.\n\nServing Path: Online: the model inference service calls the feature store SDK with a list of (entity_id, feature_names). The SDK batch-fetches from Redis and applies any missing-value defaults. Latency budget: <5ms for 20 features. Training: the training pipeline calls a point-in-time join API with a spine (entity_id, label_ts) and receives a feature DataFrame with no leakage guarantees.",
    keyPoints: [
      "Dual-store architecture (online KV store + offline columnar store) is the industry standard (Feast, Tecton, Hopsworks all use this pattern)",
      "Online and offline stores must be kept in sync — write-through on every feature update",
      "Real-time features require a streaming compute layer (Kafka + Flink); batch features use Spark/dbt",
      "Point-in-time joins on the offline store prevent training/serving skew and data leakage",
      "Feature versioning with a central registry is required to manage schema evolution across models",
      "Backfill must use event-time semantics, not processing time, to maintain historical correctness",
      "TTL-based expiry in the online store enforces freshness requirements without manual cleanup",
    ],
  },
];

export default mlSystemDesign;
