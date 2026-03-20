const pytorchCoding = [
  // ─────────────────────────────────────────────
  // pytorch-001: Linear Regression from Scratch
  // ─────────────────────────────────────────────
  {
    id: "pytorch-001",
    type: "coding",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "core",
    title: "Linear Regression from Scratch",
    tags: ["nn.Module", "MSE", "SGD", "training-loop", "autograd"],
    question:
      "Implement a linear regression model from scratch using `nn.Module`. " +
      "Write a `LinearRegressionModel` class and a `train_model` function that " +
      "trains the model on synthetic data using MSE loss and SGD optimizer. " +
      "The training function should return the trained model and a list of losses " +
      "per epoch. The model should converge (final loss < 0.1) within the given epochs.",
    hint:
      "Remember that `nn.Module` requires implementing `__init__` and `forward`. " +
      "Use `nn.Linear(in_features, out_features)` for the linear layer. " +
      "The training loop is: zero gradients, forward pass, compute loss, backward, step.",
    starterCode: `import torch
import torch.nn as nn

class LinearRegressionModel(nn.Module):
    def __init__(self, input_dim, output_dim):
        super().__init__()
        # TODO: Define a single linear layer
        pass

    def forward(self, x):
        # TODO: Forward pass through the linear layer
        pass

def train_model(X, y, epochs=100, lr=0.01):
    """
    Train a linear regression model on the given data.

    Args:
        X: Input tensor of shape (n_samples, input_dim)
        y: Target tensor of shape (n_samples, output_dim)
        epochs: Number of training epochs
        lr: Learning rate for SGD

    Returns:
        model: Trained LinearRegressionModel
        losses: List of loss values (one per epoch)
    """
    # TODO: Instantiate model, loss function (MSE), and optimizer (SGD)
    # TODO: Training loop
    pass`,
    solution: `import torch
import torch.nn as nn

class LinearRegressionModel(nn.Module):
    def __init__(self, input_dim, output_dim):
        super().__init__()
        self.linear = nn.Linear(input_dim, output_dim)

    def forward(self, x):
        return self.linear(x)

def train_model(X, y, epochs=100, lr=0.01):
    input_dim = X.shape[1]
    output_dim = y.shape[1] if y.dim() > 1 else 1
    if y.dim() == 1:
        y = y.unsqueeze(1)

    model = LinearRegressionModel(input_dim, output_dim)
    criterion = nn.MSELoss()
    optimizer = torch.optim.SGD(model.parameters(), lr=lr)

    losses = []
    for epoch in range(epochs):
        # Forward pass
        predictions = model(X)
        loss = criterion(predictions, y)

        # Backward pass and optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        losses.append(loss.item())

    return model, losses`,
    explanation:
      "This implements the fundamental PyTorch training pattern:\n\n" +
      "1. **Model Definition**: Subclass `nn.Module`, define layers in `__init__`, " +
      "implement `forward` for the computation graph.\n" +
      "2. **Loss & Optimizer**: `nn.MSELoss()` computes mean squared error. " +
      "`torch.optim.SGD` performs stochastic gradient descent on `model.parameters()`.\n" +
      "3. **Training Loop**: Each iteration: (a) forward pass to get predictions, " +
      "(b) compute loss, (c) `zero_grad()` to clear accumulated gradients, " +
      "(d) `loss.backward()` for autograd, (e) `optimizer.step()` to update weights.\n\n" +
      "The `zero_grad()` call is essential because PyTorch accumulates gradients by default.",
    testCases: [
      {
        name: "Model convergence on y = 2x + 1",
        input: "X = torch.linspace(0, 1, 100).unsqueeze(1); y = 2 * X + 1",
        expected: "Final loss < 0.1 after 200 epochs with lr=0.1",
      },
      {
        name: "Model output shape",
        input: "X = torch.randn(50, 3)",
        expected: "model(X).shape == (50, 1)",
      },
      {
        name: "Losses are decreasing",
        input: "losses list from training",
        expected: "losses[-1] < losses[0]",
      },
    ],
    timeComplexity: "O(epochs * n_samples * input_dim) for training",
    spaceComplexity: "O(input_dim * output_dim) for model parameters",
  },

  // ─────────────────────────────────────────────
  // pytorch-002: Scaled Dot-Product Attention
  // ─────────────────────────────────────────────
  {
    id: "pytorch-002",
    type: "coding",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "core",
    title: "Scaled Dot-Product Attention",
    tags: ["attention", "transformer", "softmax", "masking", "LLMs-from-scratch"],
    question:
      "Implement scaled dot-product attention as described in 'Attention Is All You Need' " +
      "and Chapter 3 of 'Build a Large Language Model (From Scratch)'. Given query (Q), " +
      "key (K), and value (V) matrices, compute:\n\n" +
      "  Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V\n\n" +
      "Support an optional causal mask that sets future positions to -infinity before softmax. " +
      "Also support an optional dropout rate applied after softmax.",
    hint:
      "Scale by `1 / sqrt(d_k)` where `d_k = K.shape[-1]`. For the causal mask, use " +
      "`torch.triu` to create an upper-triangular matrix of ones, then fill those positions " +
      "with `-torch.inf` before softmax. Use `torch.bmm` or `@` for batched matrix multiply.",
    starterCode: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None, dropout_p=0.0):
    """
    Compute scaled dot-product attention.

    Args:
        Q: Query tensor of shape (..., seq_len_q, d_k)
        K: Key tensor of shape (..., seq_len_k, d_k)
        V: Value tensor of shape (..., seq_len_k, d_v)
        mask: Optional boolean tensor where True indicates positions to mask
              Shape broadcastable to (..., seq_len_q, seq_len_k)
        dropout_p: Dropout probability applied after softmax (0.0 = no dropout)

    Returns:
        output: Attention output of shape (..., seq_len_q, d_v)
        attention_weights: Softmax weights of shape (..., seq_len_q, seq_len_k)
    """
    # TODO: Compute attention scores (Q @ K^T / sqrt(d_k))
    # TODO: Apply mask if provided (set masked positions to -inf)
    # TODO: Apply softmax
    # TODO: Apply dropout if dropout_p > 0
    # TODO: Compute output (attention_weights @ V)
    pass`,
    solution: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None, dropout_p=0.0):
    d_k = K.shape[-1]
    # Compute scaled attention scores
    attn_scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)

    # Apply mask: True positions are set to -inf (excluded from attention)
    if mask is not None:
        attn_scores = attn_scores.masked_fill(mask, float('-inf'))

    # Softmax over the key dimension
    attention_weights = F.softmax(attn_scores, dim=-1)

    # Replace any NaN from all-masked rows with 0
    attention_weights = torch.nan_to_num(attention_weights, nan=0.0)

    # Apply dropout during training
    if dropout_p > 0.0:
        attention_weights = F.dropout(attention_weights, p=dropout_p)

    # Weighted sum of values
    output = torch.matmul(attention_weights, V)

    return output, attention_weights`,
    explanation:
      "Scaled dot-product attention is the core building block of Transformers:\n\n" +
      "1. **Score Computation**: `QK^T` computes raw attention scores. Each query attends " +
      "to all keys. Shape: (..., seq_q, seq_k).\n" +
      "2. **Scaling**: Dividing by `sqrt(d_k)` prevents the dot products from growing " +
      "too large, which would push softmax into regions with tiny gradients.\n" +
      "3. **Masking**: Setting positions to `-inf` before softmax makes them contribute " +
      "zero probability. This is used for causal (autoregressive) masking and padding masks.\n" +
      "4. **Softmax**: Converts scores to a probability distribution over keys.\n" +
      "5. **nan_to_num**: When an entire row is masked, softmax produces NaN. " +
      "Replacing with 0 ensures numerical stability.\n" +
      "6. **Output**: Weighted sum `attention_weights @ V` aggregates value vectors.",
    testCases: [
      {
        name: "Output shape matches expected",
        input: "Q=K=V=torch.randn(2, 4, 8) (batch=2, seq=4, d=8)",
        expected: "output.shape == (2, 4, 8), weights.shape == (2, 4, 4)",
      },
      {
        name: "Attention weights sum to 1",
        input: "No mask applied",
        expected: "attention_weights.sum(dim=-1) approx 1.0",
      },
      {
        name: "Causal mask blocks future tokens",
        input: "mask = torch.triu(torch.ones(4,4), diagonal=1).bool()",
        expected: "attention_weights[..., 0, 1:] == 0 (first token can't see future)",
      },
    ],
    timeComplexity: "O(seq_q * seq_k * d_k + seq_q * seq_k * d_v)",
    spaceComplexity: "O(seq_q * seq_k) for attention weight matrix",
  },

  // ─────────────────────────────────────────────
  // pytorch-003: Multi-Head Self-Attention
  // ─────────────────────────────────────────────
  {
    id: "pytorch-003",
    type: "coding",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "standard",
    title: "Multi-Head Self-Attention",
    tags: ["multi-head-attention", "transformer", "QKV-projection", "concat"],
    question:
      "Implement a `MultiHeadAttention` module. It should:\n" +
      "1. Project input into Q, K, V using separate linear layers\n" +
      "2. Split the projections into `num_heads` parallel attention heads\n" +
      "3. Apply scaled dot-product attention to each head in parallel\n" +
      "4. Concatenate the heads and project with an output linear layer\n\n" +
      "The module should support an optional causal mask for autoregressive models.",
    hint:
      "For splitting heads, reshape from (batch, seq, d_model) to " +
      "(batch, num_heads, seq, d_k) where d_k = d_model // num_heads. " +
      "Use `.view()` and `.transpose()`. After attention, transpose back and " +
      "`.contiguous().view()` to concatenate heads.",
    starterCode: `import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads, dropout=0.0):
        """
        Args:
            d_model: Model dimensionality (must be divisible by num_heads)
            num_heads: Number of attention heads
            dropout: Dropout rate for attention weights
        """
        super().__init__()
        assert d_model % num_heads == 0, "d_model must be divisible by num_heads"
        # TODO: Store dimensions
        # TODO: Define W_q, W_k, W_v, W_o linear projections
        pass

    def forward(self, x, mask=None):
        """
        Args:
            x: Input tensor of shape (batch_size, seq_len, d_model)
            mask: Optional boolean mask of shape (seq_len, seq_len)
                  True = position to mask out

        Returns:
            output: Shape (batch_size, seq_len, d_model)
        """
        # TODO: Project to Q, K, V
        # TODO: Split into heads
        # TODO: Apply scaled dot-product attention
        # TODO: Concat heads and project output
        pass`,
    solution: `import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads, dropout=0.0):
        super().__init__()
        assert d_model % num_heads == 0, "d_model must be divisible by num_heads"

        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        self.dropout_p = dropout

        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        batch_size, seq_len, _ = x.shape

        # Project to Q, K, V: (batch, seq, d_model)
        Q = self.W_q(x)
        K = self.W_k(x)
        V = self.W_v(x)

        # Split into heads: (batch, seq, d_model) -> (batch, num_heads, seq, d_k)
        Q = Q.view(batch_size, seq_len, self.num_heads, self.d_k).transpose(1, 2)
        K = K.view(batch_size, seq_len, self.num_heads, self.d_k).transpose(1, 2)
        V = V.view(batch_size, seq_len, self.num_heads, self.d_k).transpose(1, 2)

        # Scaled dot-product attention per head
        attn_scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_k ** 0.5)

        if mask is not None:
            attn_scores = attn_scores.masked_fill(mask, float('-inf'))

        attn_weights = F.softmax(attn_scores, dim=-1)
        attn_weights = torch.nan_to_num(attn_weights, nan=0.0)

        if self.dropout_p > 0.0 and self.training:
            attn_weights = F.dropout(attn_weights, p=self.dropout_p)

        # (batch, num_heads, seq, d_k)
        attn_output = torch.matmul(attn_weights, V)

        # Concat heads: (batch, num_heads, seq, d_k) -> (batch, seq, d_model)
        attn_output = attn_output.transpose(1, 2).contiguous().view(
            batch_size, seq_len, self.d_model
        )

        # Output projection
        output = self.W_o(attn_output)
        return output`,
    explanation:
      "Multi-head attention lets the model attend to information from different " +
      "representation subspaces at different positions:\n\n" +
      "1. **Linear Projections**: W_q, W_k, W_v project the input into Q, K, V " +
      "of shape (batch, seq, d_model).\n" +
      "2. **Split Heads**: Reshape to (batch, num_heads, seq, d_k). Each head " +
      "operates on a d_k-dimensional slice (d_k = d_model / num_heads).\n" +
      "3. **Parallel Attention**: Scaled dot-product attention runs on all heads " +
      "simultaneously thanks to batched matrix multiplication.\n" +
      "4. **Concatenation**: Transpose and reshape back to (batch, seq, d_model), " +
      "effectively concatenating all head outputs.\n" +
      "5. **Output Projection**: W_o mixes information across heads.\n\n" +
      "Key detail: `.contiguous()` is needed after `.transpose()` before `.view()` " +
      "because transpose makes the tensor non-contiguous in memory.",
    testCases: [
      {
        name: "Output shape preserved",
        input: "x = torch.randn(2, 10, 64), num_heads=8",
        expected: "output.shape == (2, 10, 64)",
      },
      {
        name: "Parameter count",
        input: "d_model=64, num_heads=8",
        expected: "4 linear layers: 3 * (64*64 + 64) + (64*64 + 64) = 16640 params",
      },
      {
        name: "Causal mask produces valid output",
        input: "mask = torch.triu(torch.ones(10,10), diagonal=1).bool()",
        expected: "No NaN in output, output.shape == (2, 10, 64)",
      },
    ],
    timeComplexity: "O(batch * num_heads * seq^2 * d_k)",
    spaceComplexity: "O(batch * num_heads * seq^2) for attention matrices",
  },

  // ─────────────────────────────────────────────
  // pytorch-004: Causal Attention Mask
  // ─────────────────────────────────────────────
  {
    id: "pytorch-004",
    type: "coding",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "standard",
    title: "Causal Attention Mask",
    tags: ["causal-mask", "autoregressive", "triu", "variable-length"],
    question:
      "Implement two functions for causal (autoregressive) masking:\n\n" +
      "1. `create_causal_mask(seq_len)` - Creates a boolean mask where `True` means " +
      "'mask this position' (i.e., future positions are True).\n\n" +
      "2. `create_padding_causal_mask(seq_lens, max_len)` - Creates a combined causal + " +
      "padding mask for a batch of sequences with variable lengths. Padding positions " +
      "(beyond each sequence's actual length) should also be masked.\n\n" +
      "Both functions should return boolean tensors compatible with `masked_fill`.",
    hint:
      "For the causal mask, `torch.triu(torch.ones(seq_len, seq_len), diagonal=1).bool()` " +
      "gives you the upper triangle (future positions). For the padding mask, create a " +
      "(batch, 1, 1, seq_k) mask from sequence lengths and combine with the causal mask " +
      "using logical OR.",
    starterCode: `import torch

def create_causal_mask(seq_len):
    """
    Create a causal (autoregressive) mask.

    Args:
        seq_len: Sequence length

    Returns:
        mask: Boolean tensor of shape (seq_len, seq_len)
              True at positions that should be masked (future tokens)
    """
    # TODO: Return upper-triangular boolean mask
    pass

def create_padding_causal_mask(seq_lens, max_len):
    """
    Create a combined causal + padding mask for a batch of variable-length sequences.

    Args:
        seq_lens: 1D tensor of actual sequence lengths, shape (batch_size,)
        max_len: Maximum sequence length (for padding)

    Returns:
        mask: Boolean tensor of shape (batch_size, 1, max_len, max_len)
              True at positions that should be masked
              Combines causal mask (no future peeking) with padding mask
    """
    # TODO: Create causal mask
    # TODO: Create padding mask from seq_lens
    # TODO: Combine both masks
    pass`,
    solution: `import torch

def create_causal_mask(seq_len):
    return torch.triu(torch.ones(seq_len, seq_len, dtype=torch.bool), diagonal=1)

def create_padding_causal_mask(seq_lens, max_len):
    batch_size = seq_lens.shape[0]

    # Causal mask: (1, 1, max_len, max_len)
    causal_mask = torch.triu(
        torch.ones(max_len, max_len, dtype=torch.bool), diagonal=1
    ).unsqueeze(0).unsqueeze(0)

    # Padding mask for keys: positions >= seq_len are padding
    # (batch, 1, 1, max_len)
    positions = torch.arange(max_len).unsqueeze(0)  # (1, max_len)
    padding_mask = positions >= seq_lens.unsqueeze(1)  # (batch, max_len)
    padding_mask = padding_mask.unsqueeze(1).unsqueeze(2)  # (batch, 1, 1, max_len)

    # Combine: mask if causal OR if the key position is padding
    combined_mask = causal_mask | padding_mask  # broadcasts to (batch, 1, max_len, max_len)

    return combined_mask`,
    explanation:
      "Causal masking is essential for autoregressive (left-to-right) generation:\n\n" +
      "1. **Causal Mask**: `torch.triu(..., diagonal=1)` creates an upper-triangular " +
      "matrix of True values above the main diagonal. Position (i, j) is True when " +
      "j > i, meaning token i cannot attend to future token j.\n\n" +
      "2. **Padding Mask**: For batched sequences of different lengths, positions beyond " +
      "the actual length are padding. We create a (batch, max_len) boolean tensor using " +
      "`arange(max_len) >= seq_lens` and reshape to (batch, 1, 1, max_len) for " +
      "broadcasting across query positions and attention heads.\n\n" +
      "3. **Combining**: Using logical OR ensures that both future positions AND padding " +
      "positions are masked. The shape (batch, 1, max_len, max_len) broadcasts across " +
      "the num_heads dimension in multi-head attention.\n\n" +
      "The `unsqueeze` operations create dimensions for num_heads and query positions, " +
      "enabling efficient broadcasting.",
    testCases: [
      {
        name: "Causal mask shape and pattern",
        input: "seq_len=4",
        expected: "mask[0,0]==False, mask[0,1]==True, mask[3,3]==False, diagonal is False",
      },
      {
        name: "Padding mask respects sequence lengths",
        input: "seq_lens=torch.tensor([2, 4]), max_len=4",
        expected: "Batch 0: positions 2,3 always masked; Batch 1: no extra padding mask",
      },
      {
        name: "Combined mask shape",
        input: "seq_lens=torch.tensor([3, 5]), max_len=5",
        expected: "mask.shape == (2, 1, 5, 5)",
      },
    ],
    timeComplexity: "O(seq_len^2) for causal mask creation",
    spaceComplexity: "O(batch * seq_len^2) for the combined mask",
  },

  // ─────────────────────────────────────────────
  // pytorch-005: LayerNorm + Residual Block
  // ─────────────────────────────────────────────
  {
    id: "pytorch-005",
    type: "coding",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "core",
    title: "LayerNorm + Residual Block",
    tags: ["layer-norm", "residual-connection", "normalization", "from-scratch"],
    question:
      "Implement Layer Normalization from scratch (do NOT use `nn.LayerNorm`) and " +
      "a residual connection block.\n\n" +
      "1. `LayerNorm`: Normalize across the last dimension (features). Include learnable " +
      "scale (gamma) and shift (beta) parameters. Use epsilon for numerical stability.\n\n" +
      "2. `ResidualBlock`: Applies LayerNorm, passes through a sublayer function, " +
      "then adds the residual connection: `output = x + sublayer(norm(x))`",
    hint:
      "For LayerNorm: compute mean and variance across `dim=-1` with `keepdim=True`. " +
      "Then normalize: `(x - mean) / sqrt(var + eps)`. Scale by gamma and shift by beta. " +
      "Initialize gamma to ones and beta to zeros using `nn.Parameter`.",
    starterCode: `import torch
import torch.nn as nn

class LayerNorm(nn.Module):
    def __init__(self, normalized_shape, eps=1e-5):
        """
        Args:
            normalized_shape: Input shape from the last dimension
            eps: Small value for numerical stability
        """
        super().__init__()
        # TODO: Initialize learnable gamma (scale) and beta (shift)
        # TODO: Store eps
        pass

    def forward(self, x):
        """
        Args:
            x: Input tensor of shape (..., normalized_shape)
        Returns:
            Normalized tensor of same shape
        """
        # TODO: Compute mean and variance across last dimension
        # TODO: Normalize, scale, and shift
        pass

class ResidualBlock(nn.Module):
    def __init__(self, d_model, sublayer_fn):
        """
        Args:
            d_model: Dimension for LayerNorm
            sublayer_fn: nn.Module to apply after normalization
        """
        super().__init__()
        # TODO: Initialize LayerNorm and store sublayer
        pass

    def forward(self, x):
        """
        Pre-norm residual: x + sublayer(LayerNorm(x))
        """
        # TODO: Apply norm, sublayer, then add residual
        pass`,
    solution: `import torch
import torch.nn as nn

class LayerNorm(nn.Module):
    def __init__(self, normalized_shape, eps=1e-5):
        super().__init__()
        if isinstance(normalized_shape, int):
            normalized_shape = (normalized_shape,)
        self.normalized_shape = normalized_shape
        self.eps = eps
        self.gamma = nn.Parameter(torch.ones(normalized_shape))
        self.beta = nn.Parameter(torch.zeros(normalized_shape))

    def forward(self, x):
        dims = tuple(range(-len(self.normalized_shape), 0))
        mean = x.mean(dim=dims, keepdim=True)
        var = x.var(dim=dims, keepdim=True, unbiased=False)
        x_norm = (x - mean) / torch.sqrt(var + self.eps)
        return self.gamma * x_norm + self.beta

class ResidualBlock(nn.Module):
    def __init__(self, d_model, sublayer_fn):
        super().__init__()
        self.norm = LayerNorm(d_model)
        self.sublayer = sublayer_fn

    def forward(self, x):
        return x + self.sublayer(self.norm(x))`,
    explanation:
      "**Layer Normalization** normalizes across features (the last dimension) rather " +
      "than across the batch (like BatchNorm). This is essential for Transformers because:\n\n" +
      "1. **Computation**: For each token independently, compute mean and variance of " +
      "its feature vector. Normalize to zero mean, unit variance. Then apply learnable " +
      "affine transform (gamma * x_norm + beta).\n\n" +
      "2. **unbiased=False**: PyTorch's `.var()` defaults to Bessel's correction " +
      "(divides by N-1). LayerNorm uses the population variance (divides by N), " +
      "matching the `nn.LayerNorm` implementation.\n\n" +
      "3. **Residual Connection**: `x + sublayer(norm(x))` is the 'pre-norm' variant " +
      "(used in GPT-2, LLaMA). This helps with gradient flow - gradients can pass " +
      "directly through the addition, preventing vanishing gradients in deep networks.\n\n" +
      "4. **Why not BatchNorm?** BatchNorm depends on batch statistics, making it " +
      "problematic for variable-length sequences and inference with batch_size=1.",
    testCases: [
      {
        name: "LayerNorm output has zero mean, unit variance",
        input: "x = torch.randn(2, 5, 64)",
        expected: "output.mean(dim=-1) approx 0, output.var(dim=-1) approx 1",
      },
      {
        name: "Matches nn.LayerNorm",
        input: "x = torch.randn(3, 4, 32)",
        expected: "Custom LayerNorm output matches torch.nn.LayerNorm output within 1e-5",
      },
      {
        name: "Residual preserves identity at init",
        input: "sublayer = nn.Linear(64, 64) with small weights",
        expected: "ResidualBlock output is close to input x at initialization",
      },
    ],
    timeComplexity: "O(batch * seq_len * d_model) for normalization",
    spaceComplexity: "O(d_model) for gamma and beta parameters",
  },

  // ─────────────────────────────────────────────
  // pytorch-006: Transformer Block
  // ─────────────────────────────────────────────
  {
    id: "pytorch-006",
    type: "coding",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "standard",
    title: "Transformer Block",
    tags: ["transformer", "feed-forward", "pre-norm", "GPT-style"],
    question:
      "Implement a complete GPT-style Transformer block that composes:\n\n" +
      "  LayerNorm -> Multi-Head Attention -> Residual -> LayerNorm -> FFN -> Residual\n\n" +
      "The Feed-Forward Network (FFN) should use the standard pattern: " +
      "Linear(d_model, d_ff) -> GELU -> Linear(d_ff, d_model) -> Dropout.\n\n" +
      "Use the pre-norm architecture (LayerNorm before each sublayer, not after).",
    hint:
      "Use `nn.Sequential` for the FFN. The standard d_ff = 4 * d_model. " +
      "Apply dropout after both the attention output and FFN output. " +
      "Pre-norm means: residual = x + dropout(sublayer(layernorm(x))).",
    starterCode: `import torch
import torch.nn as nn
import torch.nn.functional as F

class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super().__init__()
        # TODO: Two linear layers with GELU activation and dropout
        pass

    def forward(self, x):
        pass

class TransformerBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_ff=None, dropout=0.1):
        """
        Args:
            d_model: Model dimensionality
            num_heads: Number of attention heads
            d_ff: Feed-forward inner dimension (default: 4 * d_model)
            dropout: Dropout rate
        """
        super().__init__()
        # TODO: Initialize LayerNorms, MultiHeadAttention, FeedForward, Dropouts
        pass

    def forward(self, x, mask=None):
        """
        Args:
            x: Input tensor (batch_size, seq_len, d_model)
            mask: Optional causal mask

        Returns:
            Output tensor (batch_size, seq_len, d_model)
        """
        # TODO: Pre-norm attention with residual
        # TODO: Pre-norm FFN with residual
        pass`,
    solution: `import torch
import torch.nn as nn
import torch.nn.functional as F

class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout),
        )

    def forward(self, x):
        return self.net(x)

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads, dropout=0.0):
        super().__init__()
        assert d_model % num_heads == 0
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads

        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        self.dropout_p = dropout

    def forward(self, x, mask=None):
        B, S, _ = x.shape
        Q = self.W_q(x).view(B, S, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(x).view(B, S, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(B, S, self.num_heads, self.d_k).transpose(1, 2)

        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_k ** 0.5)
        if mask is not None:
            scores = scores.masked_fill(mask, float('-inf'))
        weights = F.softmax(scores, dim=-1)
        weights = torch.nan_to_num(weights, nan=0.0)
        if self.dropout_p > 0 and self.training:
            weights = F.dropout(weights, p=self.dropout_p)

        out = torch.matmul(weights, V)
        out = out.transpose(1, 2).contiguous().view(B, S, self.d_model)
        return self.W_o(out)

class TransformerBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_ff=None, dropout=0.1):
        super().__init__()
        if d_ff is None:
            d_ff = 4 * d_model

        self.ln1 = nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, num_heads, dropout=dropout)
        self.drop1 = nn.Dropout(dropout)

        self.ln2 = nn.LayerNorm(d_model)
        self.ffn = FeedForward(d_model, d_ff, dropout=dropout)

    def forward(self, x, mask=None):
        # Pre-norm attention with residual
        x = x + self.drop1(self.attn(self.ln1(x), mask=mask))
        # Pre-norm FFN with residual
        x = x + self.ffn(self.ln2(x))
        return x`,
    explanation:
      "The Transformer block is the repeating unit in models like GPT:\n\n" +
      "1. **Pre-Norm Architecture**: GPT-2 and most modern LLMs apply LayerNorm " +
      "before each sublayer (not after, as in the original Transformer paper). " +
      "This improves training stability for deep networks.\n\n" +
      "2. **Attention Sublayer**: `x + dropout(attention(layernorm(x)))`. The residual " +
      "connection allows gradients to flow directly through the network.\n\n" +
      "3. **FFN Sublayer**: `x + ffn(layernorm(x))`. The FFN has an expansion factor " +
      "(typically 4x) that gives the model more capacity for element-wise processing. " +
      "GELU activation is standard in GPT-family models.\n\n" +
      "4. **Dropout**: Applied after attention and within the FFN for regularization.\n\n" +
      "5. **Stacking**: A full GPT model stacks N of these blocks (e.g., GPT-2 small: " +
      "N=12, d_model=768, num_heads=12).",
    testCases: [
      {
        name: "Output shape matches input",
        input: "x = torch.randn(2, 16, 128), num_heads=4",
        expected: "output.shape == (2, 16, 128)",
      },
      {
        name: "Supports causal masking",
        input: "mask = torch.triu(torch.ones(16,16), diagonal=1).bool()",
        expected: "No errors, output contains no NaN",
      },
      {
        name: "Gradient flows through residuals",
        input: "Backprop through 6 stacked TransformerBlocks",
        expected: "Gradients are non-zero for all parameters",
      },
    ],
    timeComplexity: "O(batch * seq^2 * d_model + batch * seq * d_model * d_ff)",
    spaceComplexity: "O(batch * num_heads * seq^2 + d_model * d_ff) for activations + params",
  },

  // ─────────────────────────────────────────────
  // pytorch-007: Vectorized Masked Softmax
  // ─────────────────────────────────────────────
  {
    id: "pytorch-007",
    type: "coding",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "core",
    title: "Vectorized Masked Softmax",
    tags: ["softmax", "numerical-stability", "broadcasting", "padding-mask"],
    question:
      "Implement a numerically stable masked softmax that handles:\n\n" +
      "1. **Numerical stability**: Subtract the max before exponentiation to prevent overflow.\n" +
      "2. **Padding masks**: Given a boolean mask, set masked positions to zero probability.\n" +
      "3. **All-masked rows**: If an entire row is masked, return zeros (not NaN).\n\n" +
      "Do NOT use `torch.nn.functional.softmax` - implement from scratch using " +
      "basic tensor operations (exp, sum, max).",
    hint:
      "The stable softmax formula is: `exp(x - max(x)) / sum(exp(x - max(x)))`. " +
      "Before computing, set masked positions to `-inf` so they contribute 0 after exp. " +
      "For all-masked rows, `max` of all `-inf` values gives `-inf`, and `exp(-inf - (-inf))` " +
      "= `exp(0)` = 1, causing issues. Handle this by checking where sum == 0.",
    starterCode: `import torch

def masked_softmax(logits, mask=None, dim=-1):
    """
    Numerically stable softmax with masking support.

    Args:
        logits: Raw scores tensor of any shape
        mask: Optional boolean tensor (True = mask out / ignore)
              Must be broadcastable to logits shape
        dim: Dimension along which to compute softmax

    Returns:
        Probability tensor of same shape as logits.
        Masked positions have probability 0.
        All-masked rows have all-zero probabilities.
    """
    # TODO: Apply mask by setting masked positions to -inf
    # TODO: Subtract max for numerical stability
    # TODO: Compute exp and normalize
    # TODO: Handle all-masked rows (replace NaN with 0)
    pass`,
    solution: `import torch

def masked_softmax(logits, mask=None, dim=-1):
    if mask is not None:
        logits = logits.masked_fill(mask, float('-inf'))

    # Subtract max for numerical stability (along softmax dim)
    max_vals = logits.max(dim=dim, keepdim=True).values
    # Handle all -inf rows: replace -inf max with 0 to avoid nan
    max_vals = torch.where(
        max_vals == float('-inf'),
        torch.zeros_like(max_vals),
        max_vals,
    )

    exp_logits = torch.exp(logits - max_vals)

    # For positions that were -inf, exp gives 0 (good)
    sum_exp = exp_logits.sum(dim=dim, keepdim=True)

    # Avoid division by zero for all-masked rows
    probs = exp_logits / (sum_exp + 1e-13)

    return probs`,
    explanation:
      "This implements softmax with three critical considerations:\n\n" +
      "1. **Masking First**: Setting masked positions to `-inf` ensures `exp(-inf) = 0`, " +
      "so they get zero probability. This is done before any stability computations.\n\n" +
      "2. **Max Subtraction (Log-Sum-Exp Trick)**: Without subtracting the max, large " +
      "logits cause `exp(logit)` to overflow to `inf`. Since `softmax(x) = softmax(x - c)` " +
      "for any constant c, subtracting `max(x)` keeps all exponents <= 0, preventing overflow.\n\n" +
      "3. **All-Masked Rows**: When every position is masked (-inf), `max` returns `-inf`. " +
      "Then `exp(-inf - (-inf)) = exp(nan) = nan`. We handle this by replacing `-inf` max " +
      "values with 0, making all exp values 0, and adding epsilon to the denominator to " +
      "prevent 0/0.\n\n" +
      "4. **Broadcasting**: The mask can have fewer dimensions than logits. PyTorch's " +
      "broadcasting rules handle (batch, 1, 1, seq_k) masks with (batch, heads, seq_q, seq_k) " +
      "logits automatically.",
    testCases: [
      {
        name: "Matches F.softmax when no mask",
        input: "logits = torch.randn(3, 5)",
        expected: "Output matches torch.nn.functional.softmax(logits, dim=-1)",
      },
      {
        name: "Masked positions get zero probability",
        input: "logits = torch.randn(2, 4), mask = torch.tensor([[F,F,T,T],[F,F,F,T]])",
        expected: "probs[0, 2:] == 0, probs[1, 3] == 0",
      },
      {
        name: "All-masked row returns zeros not NaN",
        input: "logits = torch.randn(2, 3), mask = torch.tensor([[T,T,T],[F,F,F]])",
        expected: "probs[0] == [0, 0, 0], probs[1].sum() approx 1.0",
      },
      {
        name: "Large logits don't cause overflow",
        input: "logits = torch.tensor([1000.0, 1001.0, 1002.0])",
        expected: "No inf or nan in output, probabilities sum to 1",
      },
    ],
    timeComplexity: "O(n) where n = total elements along softmax dimension",
    spaceComplexity: "O(n) for intermediate exp and sum tensors",
  },

  // ─────────────────────────────────────────────
  // pytorch-008: Adam Optimizer Step
  // ─────────────────────────────────────────────
  {
    id: "pytorch-008",
    type: "coding",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "standard",
    title: "Adam Optimizer Step",
    tags: ["adam", "optimizer", "bias-correction", "moment-estimates"],
    question:
      "Implement a simplified Adam optimizer from scratch. Given a parameter tensor and " +
      "its gradient, implement the Adam update rule:\n\n" +
      "1. Update biased first moment estimate: m = beta1 * m + (1 - beta1) * grad\n" +
      "2. Update biased second moment estimate: v = beta2 * v + (1 - beta2) * grad^2\n" +
      "3. Bias-correct: m_hat = m / (1 - beta1^t), v_hat = v / (1 - beta2^t)\n" +
      "4. Update: param = param - lr * m_hat / (sqrt(v_hat) + eps)\n\n" +
      "Test it on minimizing f(x) = (x - 3)^2.",
    hint:
      "Store `m`, `v`, and `t` (step count) as instance attributes. Increment `t` " +
      "each time `step()` is called. The bias correction is crucial in early steps - " +
      "without it, moment estimates are biased toward zero.",
    starterCode: `import torch

class SimpleAdam:
    def __init__(self, params, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        """
        Args:
            params: Iterable of torch.Tensor parameters to optimize
            lr: Learning rate
            beta1: Exponential decay rate for first moment
            beta2: Exponential decay rate for second moment
            eps: Small constant for numerical stability
        """
        # TODO: Store hyperparameters
        # TODO: Initialize state (m, v, t) for each parameter
        pass

    def zero_grad(self):
        """Zero out gradients for all parameters."""
        # TODO
        pass

    def step(self):
        """Perform one Adam update step for all parameters."""
        # TODO: For each parameter:
        #   1. Update m and v
        #   2. Compute bias-corrected estimates
        #   3. Update parameter
        pass

# Test: minimize f(x) = (x - 3)^2 starting from x = 0
def test_adam():
    # TODO: Create parameter, run optimization loop, verify convergence
    pass`,
    solution: `import torch

class SimpleAdam:
    def __init__(self, params, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.params = list(params)
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.t = 0

        # Initialize moment estimates for each parameter
        self.m = [torch.zeros_like(p) for p in self.params]
        self.v = [torch.zeros_like(p) for p in self.params]

    def zero_grad(self):
        for p in self.params:
            if p.grad is not None:
                p.grad.zero_()

    def step(self):
        self.t += 1
        with torch.no_grad():
            for i, p in enumerate(self.params):
                if p.grad is None:
                    continue
                grad = p.grad

                # Update biased first and second moment estimates
                self.m[i] = self.beta1 * self.m[i] + (1 - self.beta1) * grad
                self.v[i] = self.beta2 * self.v[i] + (1 - self.beta2) * grad ** 2

                # Bias-corrected moment estimates
                m_hat = self.m[i] / (1 - self.beta1 ** self.t)
                v_hat = self.v[i] / (1 - self.beta2 ** self.t)

                # Update parameter
                p -= self.lr * m_hat / (torch.sqrt(v_hat) + self.eps)

def test_adam():
    x = torch.tensor([0.0], requires_grad=True)
    optimizer = SimpleAdam([x], lr=0.1)

    for step in range(300):
        optimizer.zero_grad()
        loss = (x - 3.0) ** 2
        loss.backward()
        optimizer.step()

    assert abs(x.item() - 3.0) < 0.01, f"Expected x near 3.0, got {x.item()}"
    return x.item()`,
    explanation:
      "Adam (Adaptive Moment Estimation) is the default optimizer for training LLMs:\n\n" +
      "1. **First Moment (m)**: Exponential moving average of gradients. Acts like " +
      "momentum, smoothing out noisy gradients and accelerating convergence.\n\n" +
      "2. **Second Moment (v)**: Exponential moving average of squared gradients. " +
      "Provides per-parameter adaptive learning rates - parameters with large gradients " +
      "get smaller effective learning rates.\n\n" +
      "3. **Bias Correction**: At initialization, m and v are zero. Without correction, " +
      "early estimates are biased toward zero. Dividing by `(1 - beta^t)` corrects this. " +
      "As t grows, the correction factor approaches 1.\n\n" +
      "4. **Update Rule**: `lr * m_hat / (sqrt(v_hat) + eps)` combines momentum with " +
      "adaptive learning rates. The `eps` prevents division by zero.\n\n" +
      "5. **torch.no_grad()**: Essential to prevent the parameter update from being " +
      "tracked by autograd (would cause a memory leak and incorrect gradients).\n\n" +
      "Typical hyperparameters for LLM training: lr=1e-4 to 3e-4, beta1=0.9, beta2=0.95 or 0.999.",
    testCases: [
      {
        name: "Converges on quadratic",
        input: "f(x) = (x - 3)^2, x_init = 0, 300 steps",
        expected: "x converges to approximately 3.0",
      },
      {
        name: "Matches torch.optim.Adam",
        input: "Same parameters and gradients",
        expected: "Parameter updates match within floating point tolerance",
      },
      {
        name: "Handles multi-dimensional parameters",
        input: "param = torch.randn(3, 4, requires_grad=True)",
        expected: "All elements updated correctly",
      },
    ],
    timeComplexity: "O(n) per step where n = total number of parameters",
    spaceComplexity: "O(n) for storing m and v (2x parameter memory)",
  },

  // ─────────────────────────────────────────────
  // pytorch-009: PyTorch vs JAX Paradigm Comparison
  // ─────────────────────────────────────────────
  {
    id: "pytorch-009",
    type: "knowledge",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "core",
    title: "PyTorch vs JAX Paradigm Comparison",
    tags: ["pytorch", "jax", "eager-mode", "functional", "paradigm"],
    question:
      "Which of the following BEST describes the fundamental paradigm difference " +
      "between PyTorch and JAX?",
    format: "multiple-choice",
    options: [
      {
        id: "A",
        text:
          "PyTorch uses eager (imperative) execution with mutable state and OOP-style " +
          "modules, while JAX uses a functional paradigm with pure functions, immutable " +
          "state, and composable transformations (jit, grad, vmap).",
      },
      {
        id: "B",
        text:
          "PyTorch is faster on GPUs because it uses CUDA directly, while JAX uses " +
          "XLA compilation which adds overhead.",
      },
      {
        id: "C",
        text:
          "PyTorch only supports dynamic computation graphs, while JAX only supports " +
          "static computation graphs.",
      },
      {
        id: "D",
        text:
          "PyTorch is for research prototyping only, while JAX is designed exclusively " +
          "for production deployment at scale.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "The core paradigm difference is:\n\n" +
      "**PyTorch**: Eager/imperative execution. You define `nn.Module` classes with " +
      "mutable state (parameters stored as attributes). Operations execute immediately " +
      "as Python runs. `autograd` records a dynamic computation graph for backward passes. " +
      "This makes debugging easy (use pdb, print statements) but can be harder to optimize.\n\n" +
      "**JAX**: Functional paradigm. Models are pure functions that take parameters as " +
      "explicit arguments (no hidden mutable state). Key primitives:\n" +
      "- `jax.grad(fn)` - automatic differentiation as a function transform\n" +
      "- `jax.jit(fn)` - JIT compilation via XLA for performance\n" +
      "- `jax.vmap(fn)` - automatic vectorization / batching\n" +
      "- `jax.pmap(fn)` - automatic parallelization across devices\n\n" +
      "These compose naturally: `jax.jit(jax.vmap(jax.grad(loss_fn)))` is idiomatic JAX.\n\n" +
      "**Why B is wrong**: JAX's XLA compilation often makes it *faster*, not slower, " +
      "especially for TPUs. PyTorch also has `torch.compile` now.\n" +
      "**Why C is wrong**: Both support dynamic graphs. PyTorch has `torch.compile` for " +
      "static graphs; JAX handles some dynamism with `jax.lax.cond` and `jax.lax.scan`.\n" +
      "**Why D is wrong**: Both are used for research and production. Google DeepMind " +
      "uses JAX; Meta uses PyTorch. Both have production serving solutions.",
  },

  // ─────────────────────────────────────────────
  // pytorch-010: GPU Memory Hierarchy and Tiling
  // ─────────────────────────────────────────────
  {
    id: "pytorch-010",
    type: "knowledge",
    category: "pytorch-coding",
    categoryLabel: "PyTorch & Implementation",
    difficulty: "standard",
    title: "GPU Memory Hierarchy and Tiling",
    tags: ["GPU", "memory-hierarchy", "tiling", "flash-attention", "SRAM", "HBM"],
    question:
      "Explain why tiling (as used in FlashAttention) helps attention computation on GPUs. " +
      "In your answer, address: (1) the GPU memory hierarchy (HBM vs SRAM), " +
      "(2) why standard attention is memory-bound, and (3) how tiling reduces memory traffic.",
    format: "short-answer",
    options: null,
    correctAnswer:
      "Standard attention materializes the full N x N attention matrix in GPU HBM (high-bandwidth " +
      "memory), which is large but slow (~1-2 TB/s). Tiling loads blocks of Q, K, V into fast " +
      "on-chip SRAM (~20 TB/s on A100), computes partial softmax using the online softmax trick, " +
      "and writes only the final output back to HBM -- never materializing the full attention " +
      "matrix. This reduces HBM reads/writes from O(N^2) to O(N^2 * d / M) where M is SRAM " +
      "size, making attention IO-aware and significantly faster in practice.",
    explanation:
      "**GPU Memory Hierarchy**:\n" +
      "- **HBM (High Bandwidth Memory)**: Main GPU memory (e.g., 80GB on A100). " +
      "Bandwidth ~1.5-2 TB/s. This is where tensors live by default.\n" +
      "- **SRAM (on-chip)**: Small but ultra-fast (e.g., ~20MB per SM on A100). " +
      "Bandwidth ~19 TB/s. Used for registers and shared memory.\n\n" +
      "**Why Standard Attention is Memory-Bound**:\n" +
      "Standard attention computes S = QK^T (N x N matrix), writes S to HBM, reads S back " +
      "to apply softmax, writes the result to HBM, then reads it to multiply by V. " +
      "For sequence length N=2048 and d=128, the attention matrix is 2048x2048 = 4M elements, " +
      "but the actual compute (matrix multiplies) is fast. The bottleneck is reading/writing " +
      "this large intermediate matrix to slow HBM.\n\n" +
      "**How Tiling Helps (FlashAttention)**:\n" +
      "1. Load a block of Q (size B_r x d) and a block of K, V (size B_c x d) into SRAM\n" +
      "2. Compute the local attention block (B_r x B_c) entirely in SRAM\n" +
      "3. Use the *online softmax* trick to accumulate partial softmax results without " +
      "needing the full row - maintain running max and sum statistics\n" +
      "4. Write only the final output (N x d) to HBM, never the N x N matrix\n\n" +
      "This reduces HBM access from O(N^2) to O(N^2 * d / M), achieving 2-4x wall-clock " +
      "speedup and enabling much longer sequences (since memory is O(N) not O(N^2)).",
  },
];

export default pytorchCoding;
