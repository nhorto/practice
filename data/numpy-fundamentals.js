const numpyFundamentals = [
  // ─── Coding Questions ────────────────────────────────────────────────

  {
    id: "numpy-001",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "core",
    title: "Array Creation and Manipulation",
    tags: ["array-creation", "reshape", "transpose", "flatten", "arange", "linspace"],
    question:
      "Demonstrate core NumPy array creation and manipulation.\n\nImplement a function `array_playground(n)` that does ALL of the following and returns a dict with labeled results:\n\n1. `zeros_arr` — 2D array of zeros, shape (n, n)\n2. `ones_arr` — 1D array of ones, length n\n3. `arange_arr` — integers 0 through 2n-1 (inclusive) using `np.arange`\n4. `linspace_arr` — n evenly-spaced floats from 0.0 to 1.0 using `np.linspace`\n5. `reshaped` — `arange_arr` reshaped to (2, n)\n6. `transposed` — transpose of `reshaped`\n7. `flattened` — `transposed` flattened back to 1D\n\n**Example (n=3):**\n```\narange_arr  → [0, 1, 2, 3, 4, 5]\nreshaped    → [[0,1,2],[3,4,5]]\ntransposed  → [[0,3],[1,4],[2,5]]\nflattened   → [0,3,1,4,2,5]\n```",
    hint: "Use np.zeros, np.ones, np.arange, np.linspace for creation. Use .reshape(), .T (or np.transpose()), and .flatten() for manipulation. Note that flatten() returns a copy while ravel() returns a view when possible.",
    starterCode: `import numpy as np

def array_playground(n):
    """
    Create and manipulate arrays using core NumPy tools.

    Args:
        n: int - controls array sizes
    Returns:
        dict with keys: zeros_arr, ones_arr, arange_arr, linspace_arr,
                        reshaped, transposed, flattened
    """
    # TODO: Implement all 7 array operations
    pass`,
    solution: `import numpy as np

def array_playground(n):
    zeros_arr   = np.zeros((n, n))
    ones_arr    = np.ones(n)
    arange_arr  = np.arange(2 * n)
    linspace_arr = np.linspace(0.0, 1.0, n)
    reshaped    = arange_arr.reshape(2, n)
    transposed  = reshaped.T
    flattened   = transposed.flatten()

    return {
        "zeros_arr":    zeros_arr,
        "ones_arr":     ones_arr,
        "arange_arr":   arange_arr,
        "linspace_arr": linspace_arr,
        "reshaped":     reshaped,
        "transposed":   transposed,
        "flattened":    flattened,
    }`,
    explanation:
      "np.zeros and np.ones accept a shape tuple. np.arange works like Python's range but returns an ndarray. np.linspace includes both endpoints by default (endpoint=True). reshape() changes layout without copying data — the total number of elements must match. .T is shorthand for transpose. flatten() always returns a copy; ravel() is faster when a copy is not needed.",
    testCases: `import numpy as np

result = array_playground(3)

assert result["zeros_arr"].shape == (3, 3)
assert np.all(result["zeros_arr"] == 0)

assert result["ones_arr"].shape == (3,)
assert np.all(result["ones_arr"] == 1)

assert list(result["arange_arr"]) == [0, 1, 2, 3, 4, 5]

assert len(result["linspace_arr"]) == 3
assert result["linspace_arr"][0] == 0.0
assert result["linspace_arr"][-1] == 1.0

assert result["reshaped"].shape == (2, 3)
assert result["transposed"].shape == (3, 2)

assert list(result["flattened"]) == [0, 3, 1, 4, 2, 5]`,
    timeComplexity: "O(n) for all operations",
    spaceComplexity: "O(n^2) for the zeros matrix; O(n) for all others",
  },

  {
    id: "numpy-002",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "core",
    title: "Indexing, Slicing, and Boolean Masks",
    tags: ["fancy-indexing", "boolean-mask", "np.where", "np.argmax", "slicing"],
    question:
      "Implement `indexing_demo(arr)` that operates on a 2D NumPy array and returns a dict with:\n\n1. `top_row` — first row of `arr`\n2. `last_col` — last column of `arr` (as 1D)\n3. `sub_block` — 2x2 top-left submatrix\n4. `gt_mean_mask` — boolean mask: True where element > mean of `arr`\n5. `gt_mean_vals` — elements where `gt_mean_mask` is True\n6. `clipped` — array where values below mean are replaced by the mean (use np.where)\n7. `row_maxes` — index of the max element in each row (use np.argmax)\n\n**Assume `arr` is at least 2x2.**",
    hint: "Slicing: arr[0] for first row, arr[:, -1] for last column, arr[:2, :2] for the top-left block. Boolean indexing: arr[mask] extracts elements. np.where(condition, x, y) returns x where True, y where False. np.argmax(arr, axis=1) gives column index of max per row.",
    starterCode: `import numpy as np

def indexing_demo(arr):
    """
    Demonstrate NumPy indexing, slicing, and boolean masking.

    Args:
        arr: np.ndarray of shape (m, n), m >= 2, n >= 2
    Returns:
        dict with keys: top_row, last_col, sub_block, gt_mean_mask,
                        gt_mean_vals, clipped, row_maxes
    """
    # TODO: Implement all 7 operations
    pass`,
    solution: `import numpy as np

def indexing_demo(arr):
    mean_val = arr.mean()

    top_row      = arr[0]
    last_col     = arr[:, -1]
    sub_block    = arr[:2, :2]
    gt_mean_mask = arr > mean_val
    gt_mean_vals = arr[gt_mean_mask]
    clipped      = np.where(arr < mean_val, mean_val, arr)
    row_maxes    = np.argmax(arr, axis=1)

    return {
        "top_row":      top_row,
        "last_col":     last_col,
        "sub_block":    sub_block,
        "gt_mean_mask": gt_mean_mask,
        "gt_mean_vals": gt_mean_vals,
        "clipped":      clipped,
        "row_maxes":    row_maxes,
    }`,
    explanation:
      "arr[0] returns a view of the first row. arr[:, -1] selects all rows, last column. arr[:2, :2] is standard 2D slice. Boolean indexing (arr > mean_val) returns a boolean array of the same shape; using it as an index extracts matching elements as a flat array. np.where(cond, x, y) broadcasts element-wise. np.argmax(axis=1) reduces along columns, returning the column index of the max in each row.",
    testCases: `import numpy as np

arr = np.array([[1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]], dtype=float)

result = indexing_demo(arr)

assert list(result["top_row"]) == [1.0, 2.0, 3.0]
assert list(result["last_col"]) == [3.0, 6.0, 9.0]
assert result["sub_block"].tolist() == [[1.0, 2.0], [4.0, 5.0]]

# mean = 5.0
assert result["gt_mean_mask"].tolist() == [
    [False, False, False],
    [False, False, True],
    [True, True, True]
]
assert sorted(result["gt_mean_vals"]) == [6.0, 7.0, 8.0, 9.0]
assert np.all(result["clipped"] >= 5.0)
assert list(result["row_maxes"]) == [2, 2, 2]`,
    timeComplexity: "O(m*n) for mask and np.where; O(m*n) for argmax",
    spaceComplexity: "O(m*n)",
  },

  {
    id: "numpy-003",
    type: "knowledge",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "core",
    title: "Broadcasting Rules",
    tags: ["broadcasting", "shapes", "element-wise", "numpy-internals"],
    question:
      "Given the following pairs of array shapes, which operations are **valid** under NumPy broadcasting rules?\n\n```\nA: (3, 4) + (4,)       → ?\nB: (3, 4) + (3, 1)     → ?\nC: (3, 4) + (3,)       → ?\nD: (3, 1, 4) + (3, 4)  → ?\nE: (3, 4) + (4, 3)     → ?\n```\n\nWhich of the following correctly identifies which operations succeed and gives the output shape?",
    format: "multiple-choice",
    options: [
      {
        id: "A",
        text: "Valid: A→(3,4), B→(3,4), D→(3,3,4). Invalid: C, E. Broadcasting aligns from the right; a dimension of 1 stretches to match the other side.",
      },
      {
        id: "B",
        text: "Valid: A→(3,4), B→(3,4), C→(3,4), D→(3,3,4). Invalid: E. All pairs where one side has size 1 or the same size are compatible.",
      },
      {
        id: "C",
        text: "Valid: A→(3,4), B→(3,4), C→(3,3), D→(3,3,4). Invalid: E. Broadcasting pads from the left and stretches dimensions of size 1.",
      },
      {
        id: "D",
        text: "Valid: A→(3,4), B→(3,4), C→(3,4), D→(3,3,4), E→(3,4). All pairs are valid because NumPy automatically transposes when shapes mismatch.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "NumPy's broadcasting rules:\n1. **Align shapes from the right.** Prepend 1s to the shorter shape.\n2. **Dimensions must be equal, or one of them must be 1.** Size-1 dimensions are stretched.\n3. NumPy does NOT transpose or rotate arrays automatically.\n\n**A: (3,4) + (4,)** — (4,) becomes (1,4), stretched to (3,4). Valid → **(3,4)**\n**B: (3,4) + (3,1)** — right-dim 1 stretches to 4. Valid → **(3,4)**\n**C: (3,4) + (3,)** — (3,) becomes (1,3). Now right-aligned: (3,4) vs (1,3). Dims: 4≠3, neither is 1. **Invalid → error**\n**D: (3,1,4) + (3,4)** — (3,4) becomes (1,3,4). Dims: (3,1,4) vs (1,3,4). Middle: 1 vs 3 → stretches. Valid → **(3,3,4)**\n**E: (3,4) + (4,3)** — right-aligned: 4≠3 and 3≠4, neither is 1. **Invalid → error**\n\nThe key insight: (3,) left-pads to (1,3), which is incompatible with the last dim of 4.",
  },

  {
    id: "numpy-004",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "core",
    title: "Implement Softmax from Scratch",
    tags: ["softmax", "numerical-stability", "activation", "ML-fundamentals", "interview-classic"],
    question:
      "Implement a **numerically stable** softmax function.\n\nSoftmax converts a vector of raw scores (logits) into a probability distribution:\n```\nsoftmax(x)_i = exp(x_i) / sum(exp(x_j))\n```\n\nThe naive implementation overflows for large inputs (e.g., x=[1000, 1001]). The stable version subtracts the max before exponentiating — this does not change the output mathematically.\n\nImplement `softmax(x)` for:\n- **1D input:** a single vector of shape (n,)\n- **2D input:** a batch of shape (batch, n) — apply softmax independently to each row\n\n**Example:**\n```\nsoftmax([1.0, 2.0, 3.0]) → [0.0900, 0.2447, 0.6652]\nsoftmax([1000, 1001])    → [0.2689, 0.7311]  # must not overflow!\n```",
    hint: "Subtract np.max(x) before calling np.exp(). For 2D batches, subtract the per-row max and divide by the per-row sum. Use keepdims=True so broadcasting works correctly: x.max(axis=1, keepdims=True).",
    starterCode: `import numpy as np

def softmax(x):
    """
    Numerically stable softmax.

    Args:
        x: np.ndarray of shape (n,) or (batch, n)
    Returns:
        np.ndarray of same shape, values in (0,1) summing to 1 per row
    """
    # TODO: Subtract max for stability, then compute exp / sum(exp)
    # Handle both 1D and 2D inputs
    pass`,
    solution: `import numpy as np

def softmax(x):
    x = np.atleast_2d(x)               # treat 1D as a single-row batch
    x_shifted = x - x.max(axis=1, keepdims=True)  # numerical stability
    exp_x = np.exp(x_shifted)
    probs = exp_x / exp_x.sum(axis=1, keepdims=True)
    return probs.squeeze()              # restore original number of dims`,
    explanation:
      "The key insight: softmax(x) == softmax(x - c) for any constant c, because the c cancels in numerator and denominator. Subtracting the max shifts the largest value to 0, so exp(0)=1 is the largest exponential we compute — no overflow. Dividing by the sum normalizes to a valid probability distribution. keepdims=True preserves the axis so NumPy broadcasting works row-wise. squeeze() removes the extra batch dimension when the input was 1D.",
    testCases: `import numpy as np

# Test 1: 1D basic correctness
out = softmax(np.array([1.0, 2.0, 3.0]))
assert out.shape == (3,)
assert np.isclose(out.sum(), 1.0)
assert np.allclose(out, [0.09003057, 0.24472847, 0.66524096], atol=1e-5)

# Test 2: Numerical stability — must NOT return nan or inf
out2 = softmax(np.array([1000.0, 1001.0]))
assert not np.any(np.isnan(out2))
assert not np.any(np.isinf(out2))
assert np.isclose(out2.sum(), 1.0)
assert np.allclose(out2, [0.26894142, 0.73105858], atol=1e-5)

# Test 3: Uniform input → uniform output
out3 = softmax(np.zeros(5))
assert np.allclose(out3, [0.2, 0.2, 0.2, 0.2, 0.2])

# Test 4: 2D batch
batch = np.array([[1.0, 2.0, 3.0], [0.0, 0.0, 0.0]])
out4 = softmax(batch)
assert out4.shape == (2, 3)
assert np.allclose(out4.sum(axis=1), [1.0, 1.0])`,
    timeComplexity: "O(batch * n)",
    spaceComplexity: "O(batch * n)",
  },

  {
    id: "numpy-005",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "core",
    title: "Implement ReLU, Sigmoid, Tanh and Their Derivatives",
    tags: ["activation-functions", "relu", "sigmoid", "tanh", "backprop", "derivatives"],
    question:
      "Implement all three standard activation functions **and** their derivatives using only NumPy.\n\nFormulas:\n```\nReLU(x)      = max(0, x)           ReLU'(x)  = 1 if x > 0, else 0\nSigmoid(x)   = 1 / (1 + exp(-x))  Sigmoid'(x) = sigmoid(x) * (1 - sigmoid(x))\nTanh(x)      = (e^x - e^-x) /      Tanh'(x)  = 1 - tanh(x)^2\n               (e^x + e^-x)\n```\n\nImplement:\n- `relu(x)` and `relu_grad(x)` — gradient w.r.t. input (not output)\n- `sigmoid(x)` and `sigmoid_grad(x)`\n- `tanh_act(x)` and `tanh_grad(x)` (use `tanh_act` to avoid shadowing np.tanh)\n\nAll functions accept and return NumPy arrays of any shape.",
    hint: "ReLU: np.maximum(0, x) is cleaner than np.where. relu_grad: (x > 0).astype(float). sigmoid_grad: reuse sigmoid(x). tanh_grad: 1 - np.tanh(x)**2. Never shadow built-ins like np.tanh.",
    starterCode: `import numpy as np

def relu(x):
    """ReLU activation: max(0, x)"""
    pass

def relu_grad(x):
    """Derivative of ReLU w.r.t. x (not upstream gradient)"""
    pass

def sigmoid(x):
    """Sigmoid activation: 1 / (1 + exp(-x))"""
    pass

def sigmoid_grad(x):
    """Derivative of sigmoid w.r.t. x"""
    pass

def tanh_act(x):
    """Tanh activation"""
    pass

def tanh_grad(x):
    """Derivative of tanh w.r.t. x"""
    pass`,
    solution: `import numpy as np

def relu(x):
    return np.maximum(0, x)

def relu_grad(x):
    return (x > 0).astype(x.dtype)

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

def sigmoid_grad(x):
    s = sigmoid(x)
    return s * (1.0 - s)

def tanh_act(x):
    return np.tanh(x)

def tanh_grad(x):
    return 1.0 - np.tanh(x) ** 2`,
    explanation:
      "np.maximum(0, x) is element-wise max with a scalar — cleaner and faster than np.where. The ReLU gradient is simply the indicator function: 1 where the input was positive. Sigmoid's derivative has the elegant form s*(1-s), which avoids recomputing the exponential. Tanh is already in NumPy; its derivative 1 - tanh^2 follows from the identity sech^2(x) = 1 - tanh^2(x). Reusing np.tanh avoids numerical issues.",
    testCases: `import numpy as np

x = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])

# ReLU
assert np.allclose(relu(x), [0, 0, 0, 1, 2])
assert np.allclose(relu_grad(x), [0, 0, 0, 1, 1])

# Sigmoid
s = sigmoid(x)
assert np.all((s > 0) & (s < 1))
assert np.isclose(sigmoid(np.array([0.0])), [0.5])
assert np.allclose(sigmoid_grad(x), s * (1 - s))

# Tanh
t = tanh_act(x)
assert np.all((t > -1) & (t < 1))
assert np.isclose(tanh_act(np.array([0.0])), [0.0])
assert np.allclose(tanh_grad(x), 1 - np.tanh(x)**2)

# Shape preservation
x2d = np.random.randn(4, 3)
assert relu(x2d).shape == (4, 3)
assert sigmoid(x2d).shape == (4, 3)
assert tanh_act(x2d).shape == (4, 3)`,
    timeComplexity: "O(n) for all functions",
    spaceComplexity: "O(n)",
  },

  {
    id: "numpy-006",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "standard",
    title: "Implement Cross-Entropy Loss",
    tags: ["cross-entropy", "loss-function", "numerical-stability", "binary-ce", "categorical-ce"],
    question:
      "Implement two cross-entropy loss functions:\n\n**1. Binary Cross-Entropy** (for sigmoid output, single label):\n```\nBCE = -mean( y * log(p) + (1-y) * log(1-p) )\n```\n\n**2. Categorical Cross-Entropy** (for softmax output, one-hot or integer labels):\n```\nCCE = -mean( sum_c( y_c * log(p_c) ) )    # one-hot y\n    = -mean( log(p[true_class]) )          # integer labels\n```\n\nBoth must be **numerically stable** — clip predictions to avoid log(0).\n\nImplement:\n- `binary_cross_entropy(y_true, y_pred)` — y_true in {0,1}, y_pred in (0,1)\n- `categorical_cross_entropy(y_true, y_pred)` — y_true as integer class indices, y_pred is softmax output of shape (batch, num_classes)",
    hint: "Clip predictions: np.clip(y_pred, 1e-15, 1 - 1e-15). For categorical CE with integer labels, select the correct-class probability with y_pred[np.arange(n), y_true] then take -log and mean.",
    starterCode: `import numpy as np

def binary_cross_entropy(y_true, y_pred):
    """
    Binary cross-entropy loss.

    Args:
        y_true: np.ndarray shape (n,), values in {0, 1}
        y_pred: np.ndarray shape (n,), values in (0, 1)
    Returns:
        float - scalar loss
    """
    # TODO: Clip predictions, apply BCE formula, return mean
    pass

def categorical_cross_entropy(y_true, y_pred):
    """
    Categorical cross-entropy loss with integer labels.

    Args:
        y_true: np.ndarray shape (n,), integer class indices
        y_pred: np.ndarray shape (n, num_classes), softmax probabilities
    Returns:
        float - scalar loss
    """
    # TODO: Select correct-class probs, clip, return -mean(log)
    pass`,
    solution: `import numpy as np

EPS = 1e-15

def binary_cross_entropy(y_true, y_pred):
    y_pred = np.clip(y_pred, EPS, 1.0 - EPS)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

def categorical_cross_entropy(y_true, y_pred):
    n = len(y_true)
    y_pred = np.clip(y_pred, EPS, 1.0)
    correct_class_probs = y_pred[np.arange(n), y_true]
    return -np.mean(np.log(correct_class_probs))`,
    explanation:
      "Clipping to [1e-15, 1-1e-15] prevents log(0) = -inf which would produce NaN during backpropagation. For binary CE, both terms must be present because when y=1 only the first matters and when y=0 only the second does — but both are always computed. For categorical CE with integer labels, fancy indexing y_pred[np.arange(n), y_true] extracts the probability the model assigned to the true class for each sample — this is more efficient than one-hot encoding and avoiding the full matrix multiplication.",
    testCases: `import numpy as np

# Binary CE
y_true = np.array([1, 0, 1, 0])
y_pred = np.array([0.9, 0.1, 0.8, 0.2])
bce = binary_cross_entropy(y_true, y_pred)
assert isinstance(bce, float)
assert bce > 0
assert bce < 0.2  # good predictions → low loss

# Binary CE: perfect predictions → near-zero loss
y_pred_perfect = np.array([0.9999, 0.0001, 0.9999, 0.0001])
assert binary_cross_entropy(y_true, y_pred_perfect) < 0.001

# Binary CE: no log(0) crash
y_pred_extreme = np.array([1.0, 0.0, 1.0, 0.0])  # would blow up without clip
loss = binary_cross_entropy(y_true, y_pred_extreme)
assert np.isfinite(loss)

# Categorical CE
y_true_cat = np.array([0, 1, 2])
y_pred_cat = np.array([[0.9, 0.05, 0.05],
                        [0.1, 0.8,  0.1],
                        [0.1, 0.1,  0.8]])
cce = categorical_cross_entropy(y_true_cat, y_pred_cat)
assert cce > 0
assert cce < 0.25

# Categorical CE: uniform → high loss
y_pred_uniform = np.ones((3, 3)) / 3.0
cce_high = categorical_cross_entropy(y_true_cat, y_pred_uniform)
assert cce_high > cce`,
    timeComplexity: "O(batch * num_classes) for categorical; O(n) for binary",
    spaceComplexity: "O(n)",
  },

  {
    id: "numpy-007",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "standard",
    title: "Linear Layer Forward Pass",
    tags: ["linear-layer", "forward-pass", "matmul", "bias", "neural-network"],
    question:
      "Implement the forward pass of a fully-connected (linear) layer:\n```\nY = X @ W.T + b\n```\n\nWhere:\n- X is the input batch: shape **(batch_size, in_features)**\n- W is the weight matrix: shape **(out_features, in_features)**\n- b is the bias vector: shape **(out_features,)**\n- Y is the output: shape **(batch_size, out_features)**\n\nImplement `linear_forward(X, W, b)` that returns Y.\n\nAlso implement `linear_init(in_features, out_features)` that initializes W with **Xavier/Glorot uniform** initialization and b with zeros.\n\n**Xavier uniform:** sample from Uniform(-limit, +limit) where `limit = sqrt(6 / (in + out))`",
    hint: "Use np.dot or the @ operator for matrix multiply. Xavier init: np.random.uniform(-limit, limit, size). Bias is added via broadcasting — shape (out_features,) broadcasts across the batch dimension automatically.",
    starterCode: `import numpy as np

def linear_init(in_features, out_features):
    """
    Initialize weights with Xavier uniform, bias with zeros.

    Returns:
        W: np.ndarray shape (out_features, in_features)
        b: np.ndarray shape (out_features,)
    """
    # TODO: Xavier uniform init for W, zeros for b
    pass

def linear_forward(X, W, b):
    """
    Forward pass: Y = X @ W.T + b

    Args:
        X: np.ndarray shape (batch_size, in_features)
        W: np.ndarray shape (out_features, in_features)
        b: np.ndarray shape (out_features,)
    Returns:
        Y: np.ndarray shape (batch_size, out_features)
    """
    # TODO: Implement the affine transformation
    pass`,
    solution: `import numpy as np

def linear_init(in_features, out_features):
    limit = np.sqrt(6.0 / (in_features + out_features))
    W = np.random.uniform(-limit, limit, size=(out_features, in_features))
    b = np.zeros(out_features)
    return W, b

def linear_forward(X, W, b):
    return X @ W.T + b`,
    explanation:
      "The convention W has shape (out, in) so that Y = X @ W.T gives (batch, out). This matches PyTorch's nn.Linear layout. Xavier uniform initialization keeps variance roughly constant across layers: sampling from Uniform(-sqrt(6/(fan_in+fan_out)), +sqrt(6/(fan_in+fan_out))) ensures the variance of activations remains stable at initialization, which significantly improves gradient flow in deep networks. The bias broadcasts automatically because (batch, out) + (out,) aligns on the last axis.",
    testCases: `import numpy as np
np.random.seed(42)

# Init shapes
W, b = linear_init(4, 8)
assert W.shape == (8, 4)
assert b.shape == (8,)
assert np.all(b == 0)
limit = np.sqrt(6.0 / 12.0)
assert np.all(np.abs(W) <= limit + 1e-9)

# Forward pass shape
X = np.random.randn(16, 4)
Y = linear_forward(X, W, b)
assert Y.shape == (16, 8)

# Simple correctness check
W2 = np.eye(3)
b2 = np.zeros(3)
X2 = np.array([[1.0, 2.0, 3.0]])
out = linear_forward(X2, W2, b2)
assert np.allclose(out, [[1.0, 2.0, 3.0]])

# Bias is applied
b3 = np.array([1.0, 2.0, 3.0])
out3 = linear_forward(X2, W2, b3)
assert np.allclose(out3, [[2.0, 4.0, 6.0]])`,
    timeComplexity: "O(batch * in_features * out_features)",
    spaceComplexity: "O(batch * out_features)",
  },

  {
    id: "numpy-008",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "standard",
    title: "Linear Layer Backward Pass",
    tags: ["backpropagation", "gradients", "chain-rule", "dW", "dX", "db"],
    question:
      "Implement the **backward pass** of a linear layer (Y = X @ W.T + b) given the upstream gradient dL/dY.\n\nUsing the chain rule:\n```\ndL/dW = dL/dY.T @ X          shape: (out_features, in_features)\ndL/db = sum of dL/dY over batch   shape: (out_features,)\ndL/dX = dL/dY @ W              shape: (batch_size, in_features)\n```\n\nImplement `linear_backward(dY, X, W)` that returns `(dW, db, dX)`.\n\n**Shapes reference:**\n- dY: (batch, out)\n- X:  (batch, in)\n- W:  (out, in)\n- dW: (out, in)\n- db: (out,)\n- dX: (batch, in)",
    hint: "dW = dY.T @ X (out x batch) @ (batch x in) = (out x in). db = dY.sum(axis=0) — sum over the batch dimension. dX = dY @ W — multiply upstream gradient by W (not W.T) because we need the gradient w.r.t. the input.",
    starterCode: `import numpy as np

def linear_backward(dY, X, W):
    """
    Backward pass for Y = X @ W.T + b

    Args:
        dY: np.ndarray shape (batch, out_features) — upstream gradient dL/dY
        X:  np.ndarray shape (batch, in_features)  — saved input from forward pass
        W:  np.ndarray shape (out_features, in_features) — weight matrix
    Returns:
        dW: np.ndarray shape (out_features, in_features)
        db: np.ndarray shape (out_features,)
        dX: np.ndarray shape (batch, in_features)
    """
    # TODO: Compute all three gradients
    pass`,
    solution: `import numpy as np

def linear_backward(dY, X, W):
    dW = dY.T @ X          # (out, batch) @ (batch, in) = (out, in)
    db = dY.sum(axis=0)    # sum over batch → (out,)
    dX = dY @ W            # (batch, out) @ (out, in) = (batch, in)
    return dW, db, dX`,
    explanation:
      "These gradients follow directly from the chain rule applied to matrix calculus. dL/dW: the output Y[i,j] = sum_k X[i,k] * W[j,k] + b[j], so dL/dW[j,k] = sum_i dL/dY[i,j] * X[i,k], which is the (j,k) element of dY.T @ X. dL/db[j] = sum_i dL/dY[i,j], summing out the batch. dL/dX[i,k] = sum_j dL/dY[i,j] * W[j,k], which is (dY @ W)[i,k]. Summing db over axis=0 correctly accumulates bias gradients across the batch — a common mistake is forgetting this sum.",
    testCases: `import numpy as np
np.random.seed(0)

batch, in_f, out_f = 4, 5, 3
X  = np.random.randn(batch, in_f)
W  = np.random.randn(out_f, in_f)
dY = np.random.randn(batch, out_f)

dW, db, dX = linear_backward(dY, X, W)

assert dW.shape == (out_f, in_f)
assert db.shape == (out_f,)
assert dX.shape == (batch, in_f)

# Gradient check: dW
assert np.allclose(dW, dY.T @ X)
assert np.allclose(db, dY.sum(axis=0))
assert np.allclose(dX, dY @ W)

# Numerical gradient check for dX[0,0]
eps = 1e-5
X_plus  = X.copy(); X_plus[0,0]  += eps
X_minus = X.copy(); X_minus[0,0] -= eps
Y_plus  = X_plus  @ W.T
Y_minus = X_minus @ W.T
loss_plus  = Y_plus.sum()
loss_minus = Y_minus.sum()
numerical_dX00 = (loss_plus - loss_minus) / (2 * eps)
assert np.isclose(dX[0, 0], numerical_dX00, atol=1e-4)`,
    timeComplexity: "O(batch * in * out) for dW and dX; O(batch * out) for db",
    spaceComplexity: "O(out * in) + O(out) + O(batch * in)",
  },

  {
    id: "numpy-009",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "stretch",
    title: "Implement Batch Normalization Forward Pass",
    tags: ["batch-normalization", "normalize", "gamma", "beta", "training-inference"],
    question:
      "Implement the **forward pass** of Batch Normalization.\n\nBatch Norm normalizes each feature across the batch, then applies learnable scale (gamma) and shift (beta):\n```\n1. mu    = mean(X, axis=0)          # per-feature mean\n2. var   = variance(X, axis=0)      # per-feature variance\n3. X_hat = (X - mu) / sqrt(var + eps)  # normalize\n4. Y     = gamma * X_hat + beta     # scale and shift\n```\n\nImplement `batch_norm_forward(X, gamma, beta, eps=1e-8)` that returns:\n- `Y`: the normalized output, shape (batch, features)\n- `cache`: a dict with `{\"X_hat\": ..., \"mu\": ..., \"var\": ..., \"gamma\": ...}` needed for the backward pass\n\n**Shapes:** X: (batch, features), gamma: (features,), beta: (features,)",
    hint: "Compute mean and variance with np.mean(X, axis=0) and np.var(X, axis=0) — both reduce over the batch dimension (axis=0), producing vectors of shape (features,). The eps prevents division by zero when variance is 0. Broadcasting handles the subtraction and division element-wise.",
    starterCode: `import numpy as np

def batch_norm_forward(X, gamma, beta, eps=1e-8):
    """
    Batch Normalization forward pass.

    Args:
        X:     np.ndarray shape (batch, features)
        gamma: np.ndarray shape (features,) — learnable scale
        beta:  np.ndarray shape (features,) — learnable shift
        eps:   float — small constant for numerical stability
    Returns:
        Y:     np.ndarray shape (batch, features) — normalized output
        cache: dict with X_hat, mu, var, gamma for backward pass
    """
    # TODO: Normalize then scale+shift; return Y and cache
    pass`,
    solution: `import numpy as np

def batch_norm_forward(X, gamma, beta, eps=1e-8):
    mu    = X.mean(axis=0)                        # (features,)
    var   = X.var(axis=0)                         # (features,)
    X_hat = (X - mu) / np.sqrt(var + eps)         # (batch, features)
    Y     = gamma * X_hat + beta                  # (batch, features)

    cache = {"X_hat": X_hat, "mu": mu, "var": var, "gamma": gamma, "eps": eps}
    return Y, cache`,
    explanation:
      "Batch Norm is computed per feature across the batch dimension (axis=0). This means each feature's mean and variance are estimated from the current mini-batch — hence 'batch' normalization. The normalized output X_hat has mean 0 and variance 1 per feature. gamma and beta are learnable parameters that restore representational capacity: if the network learns gamma=sqrt(var) and beta=mu, it can undo the normalization entirely. The cache stores everything needed for the backward pass — specifically X_hat, gamma, and variance — because the backward gradients require these saved values. In inference mode (not shown here), a running mean/variance estimated during training is used instead of the batch statistics.",
    testCases: `import numpy as np
np.random.seed(1)

batch, features = 32, 8
X = np.random.randn(batch, features) * 3 + 5  # mean~5, std~3

gamma = np.ones(features)
beta  = np.zeros(features)

Y, cache = batch_norm_forward(X, gamma, beta)

# Output shape
assert Y.shape == (batch, features)

# With gamma=1, beta=0: output should be approximately normalized
assert np.allclose(Y.mean(axis=0), 0.0, atol=1e-5)
assert np.allclose(Y.var(axis=0),  1.0, atol=1e-4)

# Cache contents
assert "X_hat" in cache and "mu" in cache and "var" in cache and "gamma" in cache
assert cache["mu"].shape == (features,)
assert cache["var"].shape == (features,)

# Non-trivial gamma and beta
gamma2 = np.full(features, 2.0)
beta2  = np.full(features, 3.0)
Y2, _ = batch_norm_forward(X, gamma2, beta2)
assert np.allclose(Y2.mean(axis=0), 3.0, atol=1e-4)
assert np.allclose(Y2.var(axis=0),  4.0, atol=1e-3)`,
    timeComplexity: "O(batch * features)",
    spaceComplexity: "O(batch * features) for X_hat in cache",
  },

  {
    id: "numpy-010",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "core",
    title: "Matrix Operations Essentials",
    tags: ["dot-product", "outer-product", "matmul", "inverse", "determinant", "transpose"],
    question:
      "Implement `matrix_ops(u, v, A)` where `u` and `v` are 1D vectors of the same length and `A` is a square invertible matrix. Return a dict with:\n\n1. `dot` — scalar dot product of u and v\n2. `outer` — outer product matrix of u and v, shape (len(u), len(v))\n3. `mat_vec` — matrix-vector product A @ u\n4. `mat_mat` — matrix-matrix product A @ A\n5. `transpose` — transpose of A\n6. `inverse` — inverse of A\n7. `det` — determinant of A\n8. `trace` — trace of A (sum of diagonal elements)\n\nUse NumPy's built-in linear algebra functions — do not implement these from scratch.",
    hint: "np.dot(u, v) for dot product. np.outer(u, v) for outer product. @ operator or np.matmul for matrix multiply. np.linalg.inv for inverse. np.linalg.det for determinant. np.trace for trace. .T for transpose.",
    starterCode: `import numpy as np

def matrix_ops(u, v, A):
    """
    Demonstrate core matrix operations.

    Args:
        u: np.ndarray shape (n,) — first vector
        v: np.ndarray shape (n,) — second vector
        A: np.ndarray shape (n, n) — square invertible matrix
    Returns:
        dict with keys: dot, outer, mat_vec, mat_mat, transpose, inverse, det, trace
    """
    # TODO: Implement all 8 matrix operations
    pass`,
    solution: `import numpy as np

def matrix_ops(u, v, A):
    return {
        "dot":       np.dot(u, v),
        "outer":     np.outer(u, v),
        "mat_vec":   A @ u,
        "mat_mat":   A @ A,
        "transpose": A.T,
        "inverse":   np.linalg.inv(A),
        "det":       np.linalg.det(A),
        "trace":     np.trace(A),
    }`,
    explanation:
      "np.dot on 1D arrays is the scalar dot product. np.outer produces a rank-1 matrix: outer[i,j] = u[i]*v[j]. The @ operator calls np.matmul, which is preferred over np.dot for matrices (np.dot on 2D arrays is the same but @ is clearer). np.linalg.inv uses LU decomposition and is O(n^3). np.linalg.det computes the determinant via LU as well. np.trace sums the main diagonal. Note: in practice, avoid computing the explicit inverse — use np.linalg.solve(A, b) instead of inv(A) @ b for better numerical stability.",
    testCases: `import numpy as np

u = np.array([1.0, 2.0, 3.0])
v = np.array([4.0, 5.0, 6.0])
A = np.array([[2.0, 1.0, 0.0],
              [1.0, 3.0, 1.0],
              [0.0, 1.0, 2.0]])

result = matrix_ops(u, v, A)

assert np.isclose(result["dot"], 32.0)   # 1*4 + 2*5 + 3*6

assert result["outer"].shape == (3, 3)
assert result["outer"][0, 1] == 5.0      # u[0]*v[1]

assert result["mat_vec"].shape == (3,)
assert np.allclose(result["mat_vec"], A @ u)

assert result["mat_mat"].shape == (3, 3)
assert np.allclose(result["mat_mat"], A @ A)

assert np.allclose(result["transpose"], A.T)

# A @ A_inv should be identity
assert np.allclose(A @ result["inverse"], np.eye(3), atol=1e-10)

assert np.isclose(result["det"], np.linalg.det(A))
assert np.isclose(result["trace"], 7.0)  # 2+3+2`,
    timeComplexity: "O(n^3) for inverse and matmul; O(n^2) for outer; O(n) for dot, trace",
    spaceComplexity: "O(n^2)",
  },

  {
    id: "numpy-011",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "standard",
    title: "Log-Sum-Exp Trick",
    tags: ["logsumexp", "numerical-stability", "log-space", "softmax"],
    question:
      "Implement the **log-sum-exp** function in a numerically stable way:\n```\nlog_sum_exp(x) = log( sum( exp(x_i) ) )\n```\n\nThe naive version overflows for large x (e.g., x=[1000, 1001]). The stable version:\n```\nlog_sum_exp(x) = max(x) + log( sum( exp(x_i - max(x)) ) )\n```\n\nImplement:\n1. `log_sum_exp(x)` — for a 1D array, return a scalar\n2. `log_sum_exp_batch(X, axis)` — for an ND array, reduce along the given axis\n\n**Bonus understanding:** Softmax can be written as: `softmax(x)_i = exp(x_i - log_sum_exp(x))`",
    hint: "Subtract the max before exponentiating. For the batch version, use keepdims=True when computing the max so broadcasting works: x.max(axis=axis, keepdims=True). Then add back the max after taking log.",
    starterCode: `import numpy as np

def log_sum_exp(x):
    """
    Numerically stable log-sum-exp for a 1D array.

    Args:
        x: np.ndarray shape (n,)
    Returns:
        float - log(sum(exp(x)))
    """
    # TODO: Subtract max, exponentiate, sum, log, add max back
    pass

def log_sum_exp_batch(X, axis=-1):
    """
    Numerically stable log-sum-exp reducing along a given axis.

    Args:
        X:    np.ndarray of any shape
        axis: int - axis to reduce along (default: last axis)
    Returns:
        np.ndarray with the specified axis removed
    """
    # TODO: Same trick but generalized to arbitrary axis
    pass`,
    solution: `import numpy as np

def log_sum_exp(x):
    c = x.max()
    return c + np.log(np.sum(np.exp(x - c)))

def log_sum_exp_batch(X, axis=-1):
    c = X.max(axis=axis, keepdims=True)
    return c.squeeze(axis=axis) + np.log(np.sum(np.exp(X - c), axis=axis))`,
    explanation:
      "The mathematical identity: log(sum(exp(x_i))) = c + log(sum(exp(x_i - c))) holds for any constant c. Choosing c = max(x) ensures exp(x_i - c) is at most 1.0, so no overflow occurs. Underflows to zero are harmless — they just represent negligible probability mass. This trick is foundational: it underlies stable softmax, attention score computation, and any probability computation done in log space. The batch version uses keepdims=True to preserve the axis for broadcasting during subtraction, then squeeze removes it from the final result.",
    testCases: `import numpy as np

# Basic correctness (small values)
x = np.array([1.0, 2.0, 3.0])
expected = np.log(np.exp(1) + np.exp(2) + np.exp(3))
assert np.isclose(log_sum_exp(x), expected)

# Large values — naive would overflow
x_large = np.array([1000.0, 1001.0, 1002.0])
result = log_sum_exp(x_large)
assert np.isfinite(result)
assert np.isclose(result, 1002.0 + np.log(np.exp(-2) + np.exp(-1) + 1.0))

# Batch version: shape (3, 4), reduce along axis=1
X = np.random.randn(3, 4)
out = log_sum_exp_batch(X, axis=1)
assert out.shape == (3,)
for i in range(3):
    assert np.isclose(out[i], log_sum_exp(X[i]))

# Relation to softmax
x_test = np.array([1.0, 2.0, 3.0])
lse = log_sum_exp(x_test)
softmax_via_lse = np.exp(x_test - lse)
from_formula = np.exp(x_test) / np.exp(x_test).sum()
assert np.allclose(softmax_via_lse, from_formula, atol=1e-10)`,
    timeComplexity: "O(n) for 1D; O(product of all dims) for batch",
    spaceComplexity: "O(n) for intermediate exp array",
  },

  {
    id: "numpy-012",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "standard",
    title: "Implement K-Means Clustering",
    tags: ["k-means", "clustering", "euclidean-distance", "centroid", "unsupervised"],
    question:
      "Implement K-Means clustering from scratch using only NumPy.\n\nAlgorithm:\n1. **Initialize** k centroids by randomly selecting k data points\n2. **Assign** each point to the nearest centroid (by Euclidean distance)\n3. **Update** each centroid as the mean of all points assigned to it\n4. **Repeat** steps 2-3 until convergence (centroids don't change) or max_iters is reached\n\nImplement `kmeans(X, k, max_iters=100, seed=42)` that returns:\n- `centroids`: final centroid positions, shape (k, features)\n- `labels`: cluster assignment for each point, shape (n,)\n\n**Computing distances efficiently:** Use broadcasting to compute the full distance matrix without loops over n.",
    hint: "Distance matrix: dist[i,j] = ||X[i] - centroids[j]||. With broadcasting: (X[:, np.newaxis, :] - centroids[np.newaxis, :, :])**2 gives shape (n, k, features); sum over axis=2 then sqrt. np.argmin(dist, axis=1) gives labels. Handle empty clusters by reinitializing to a random point.",
    starterCode: `import numpy as np

def kmeans(X, k, max_iters=100, seed=42):
    """
    K-Means clustering.

    Args:
        X:         np.ndarray shape (n, features)
        k:         int - number of clusters
        max_iters: int - maximum number of iterations
        seed:      int - random seed for reproducibility
    Returns:
        centroids: np.ndarray shape (k, features)
        labels:    np.ndarray shape (n,) - cluster index for each point
    """
    # TODO: Initialize centroids, then iterate assign→update until convergence
    pass`,
    solution: `import numpy as np

def kmeans(X, k, max_iters=100, seed=42):
    rng = np.random.default_rng(seed)
    n, features = X.shape

    # Initialize by randomly picking k data points as centroids
    idx = rng.choice(n, size=k, replace=False)
    centroids = X[idx].copy()

    labels = np.zeros(n, dtype=int)

    for _ in range(max_iters):
        # --- Assignment step ---
        # (n, k, features)
        diff = X[:, np.newaxis, :] - centroids[np.newaxis, :, :]
        dist_sq = (diff ** 2).sum(axis=2)       # (n, k)
        new_labels = np.argmin(dist_sq, axis=1)  # (n,)

        # Convergence check
        if np.array_equal(new_labels, labels):
            break
        labels = new_labels

        # --- Update step ---
        new_centroids = np.zeros_like(centroids)
        for j in range(k):
            mask = labels == j
            if mask.sum() > 0:
                new_centroids[j] = X[mask].mean(axis=0)
            else:
                # Empty cluster: reinitialize to a random point
                new_centroids[j] = X[rng.choice(n)]
        centroids = new_centroids

    return centroids, labels`,
    explanation:
      "The broadcasting trick X[:, np.newaxis, :] - centroids[np.newaxis, :, :] creates a (n, k, features) tensor of differences, avoiding an explicit loop over n points or k centroids. Summing squared differences over axis=2 gives the squared Euclidean distance matrix (n, k). Argmin along axis=1 assigns each point to the nearest centroid. Empty cluster handling is critical in practice — without it, some centroids can become NaN (mean of zero points) and the algorithm diverges. The convergence check compares label arrays to detect when assignments have stabilized.",
    testCases: `import numpy as np

# Well-separated clusters should be found correctly
np.random.seed(0)
cluster1 = np.random.randn(50, 2) + np.array([0, 0])
cluster2 = np.random.randn(50, 2) + np.array([10, 0])
cluster3 = np.random.randn(50, 2) + np.array([5, 8])
X = np.vstack([cluster1, cluster2, cluster3])

centroids, labels = kmeans(X, k=3, seed=0)

assert centroids.shape == (3, 2)
assert labels.shape == (150,)
assert set(labels) == {0, 1, 2}

# Each original cluster should map to exactly one label
labels1 = labels[:50]
labels2 = labels[50:100]
labels3 = labels[100:]
assert len(set(labels1)) == 1  # all same label
assert len(set(labels2)) == 1
assert len(set(labels3)) == 1
assert len({labels1[0], labels2[0], labels3[0]}) == 3  # three distinct labels`,
    timeComplexity: "O(n * k * features * max_iters)",
    spaceComplexity: "O(n * k * features) for the distance matrix",
  },

  {
    id: "numpy-013",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "core",
    title: "Implement L1 and L2 Regularization",
    tags: ["regularization", "L1", "L2", "lasso", "ridge", "weight-decay", "gradient"],
    question:
      "Implement L1 and L2 regularization penalty terms and their gradients.\n\n**L2 (Ridge) regularization:**\n```\nL2_penalty = (lambda / 2) * sum(W^2)\nL2_grad    = lambda * W\n```\n\n**L1 (Lasso) regularization:**\n```\nL1_penalty = lambda * sum(|W|)\nL1_grad    = lambda * sign(W)\n```\n\nImplement:\n- `l2_penalty(W, lam)` → scalar\n- `l2_grad(W, lam)` → array same shape as W\n- `l1_penalty(W, lam)` → scalar\n- `l1_grad(W, lam)` → array same shape as W\n\nThe gradient functions return the gradient of the regularization term only — to use them, add the result to the gradient from the data loss.",
    hint: "L2 gradient is just lambda * W. L1 gradient uses np.sign(W) — note np.sign(0) = 0, which is the subgradient choice at zero. The factor of 1/2 in L2 is a convenience so that the gradient is simply lambda*W (no factor of 2).",
    starterCode: `import numpy as np

def l2_penalty(W, lam):
    """L2 regularization penalty: (lam/2) * sum(W^2)"""
    pass

def l2_grad(W, lam):
    """Gradient of L2 penalty w.r.t. W: lam * W"""
    pass

def l1_penalty(W, lam):
    """L1 regularization penalty: lam * sum(|W|)"""
    pass

def l1_grad(W, lam):
    """Subgradient of L1 penalty w.r.t. W: lam * sign(W)"""
    pass`,
    solution: `import numpy as np

def l2_penalty(W, lam):
    return (lam / 2.0) * np.sum(W ** 2)

def l2_grad(W, lam):
    return lam * W

def l1_penalty(W, lam):
    return lam * np.sum(np.abs(W))

def l1_grad(W, lam):
    return lam * np.sign(W)`,
    explanation:
      "L2 regularization (weight decay) penalizes large weights quadratically, pushing them toward zero but never exactly to zero. The 1/2 factor is a convention that makes the gradient lam*W (rather than 2*lam*W). L1 regularization penalizes the absolute values, encouraging exact sparsity — many weights go to exactly zero — because the gradient is a constant magnitude regardless of weight size (unlike L2). np.sign returns -1, 0, or +1 element-wise; 0 at the origin is the standard subgradient choice. In practice, L2 is more common for neural networks (as weight decay in Adam), while L1 appears in feature selection (Lasso regression).",
    testCases: `import numpy as np

W = np.array([[1.0, -2.0], [0.0, 3.0]])
lam = 0.1

# L2 penalty: 0.1/2 * (1+4+0+9) = 0.7
assert np.isclose(l2_penalty(W, lam), 0.7)

# L2 grad
assert np.allclose(l2_grad(W, lam), lam * W)

# L1 penalty: 0.1 * (1+2+0+3) = 0.6
assert np.isclose(l1_penalty(W, lam), 0.6)

# L1 grad
expected_sign = np.array([[1.0, -1.0], [0.0, 1.0]])
assert np.allclose(l1_grad(W, lam), lam * expected_sign)

# Shape preservation
assert l2_grad(W, lam).shape == W.shape
assert l1_grad(W, lam).shape == W.shape

# Larger lambda → larger penalty
assert l2_penalty(W, 1.0) > l2_penalty(W, 0.1)
assert l1_penalty(W, 1.0) > l1_penalty(W, 0.1)`,
    timeComplexity: "O(n) where n = number of weights",
    spaceComplexity: "O(n) for gradient arrays",
  },

  {
    id: "numpy-014",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "standard",
    title: "Implement Dropout Forward Pass",
    tags: ["dropout", "regularization", "inverted-dropout", "random-mask", "training"],
    question:
      "Implement **inverted dropout** for the training-time forward pass.\n\nDropout randomly zeros out neurons during training to prevent co-adaptation. In the **inverted** variant, the surviving activations are scaled up by `1/keep_prob` during training so that the expected output magnitude stays the same — no adjustment is needed at test time.\n\nAlgorithm (training mode):\n```\n1. Generate random mask: each element is 1 with probability keep_prob, else 0\n2. Apply mask: out = X * mask\n3. Scale up: out = out / keep_prob\n```\n\nImplement `dropout_forward(X, keep_prob, training=True, seed=None)` that returns:\n- `out`: the output array, same shape as X\n- `mask`: the binary mask used (needed for backward pass), or None if not training",
    hint: "Use np.random.binomial(1, keep_prob, size=X.shape) or (np.random.rand(*X.shape) < keep_prob).astype(float) to generate the mask. When training=False, return X unchanged and mask=None. Always divide by keep_prob (not multiply by drop_prob).",
    starterCode: `import numpy as np

def dropout_forward(X, keep_prob, training=True, seed=None):
    """
    Inverted dropout forward pass.

    Args:
        X:         np.ndarray of any shape — input activations
        keep_prob: float in (0, 1] — probability of keeping a neuron
        training:  bool — apply dropout only during training
        seed:      int or None — random seed for reproducibility
    Returns:
        out:  np.ndarray same shape as X
        mask: np.ndarray same shape as X (binary), or None in eval mode
    """
    # TODO: Generate mask, apply it, scale; handle eval mode
    pass`,
    solution: `import numpy as np

def dropout_forward(X, keep_prob, training=True, seed=None):
    if not training:
        return X, None

    if seed is not None:
        np.random.seed(seed)

    mask = (np.random.rand(*X.shape) < keep_prob).astype(X.dtype)
    out  = X * mask / keep_prob
    return out, mask`,
    explanation:
      "The inverted scaling (dividing by keep_prob) during training is the key design choice. Without it, you would need to multiply by keep_prob at test time — but that requires modifying the inference path. With inverted dropout, test-time inference uses the model unchanged. The mask is stored in the cache for the backward pass: the gradient flowing back through dropout is simply `dX = dout * mask / keep_prob` — the same mask zeroes out the same neurons and rescales. When keep_prob=1.0 there is no dropout. Using (rand < keep_prob) produces a Bernoulli mask more efficiently than np.random.binomial for large arrays.",
    testCases: `import numpy as np

X = np.ones((100, 50))  # all ones for easy statistics

# Training mode: roughly keep_prob fraction of neurons survive
out, mask = dropout_forward(X, keep_prob=0.5, training=True, seed=42)
assert out.shape == X.shape
assert mask.shape == X.shape
assert np.all((mask == 0) | (mask == 1))  # binary mask
keep_rate = mask.mean()
assert 0.4 < keep_rate < 0.6  # approximately 50% kept

# Inverted scaling: expected value of out should be ~1.0
assert np.isclose(out.mean(), 1.0, atol=0.1)

# Eval mode: output equals input exactly
out_eval, mask_eval = dropout_forward(X, keep_prob=0.5, training=False)
assert np.array_equal(out_eval, X)
assert mask_eval is None

# keep_prob=1.0: no dropout at all
out_full, mask_full = dropout_forward(X, keep_prob=1.0, training=True, seed=0)
assert np.array_equal(out_full, X)

# Different seeds give different masks
_, mask1 = dropout_forward(X, keep_prob=0.5, training=True, seed=1)
_, mask2 = dropout_forward(X, keep_prob=0.5, training=True, seed=2)
assert not np.array_equal(mask1, mask2)`,
    timeComplexity: "O(n) where n = total elements in X",
    spaceComplexity: "O(n) for the mask",
  },

  {
    id: "numpy-015",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "stretch",
    title: "Implement 2D Convolution from Scratch",
    tags: ["convolution", "CNN", "im2col", "feature-maps", "sliding-window"],
    question:
      "Implement a naive **2D convolution** (cross-correlation) from scratch using only NumPy.\n\nFor a single-channel input and single filter:\n```\noutput[i, j] = sum over (ki, kj): input[i+ki, j+kj] * kernel[ki, kj]\n```\n\nImplement `conv2d(X, kernel, stride=1, padding=0)` where:\n- X: input image, shape **(H, W)** — single channel\n- kernel: shape **(kH, kW)**\n- stride: step size (default 1)\n- padding: zero-padding added to each side (default 0)\n\nOutput shape: `(floor((H + 2*padding - kH) / stride) + 1, same for W)`\n\nReturn the output feature map. Use nested loops — correctness over speed for this exercise.",
    hint: "Pad X with np.pad(X, padding, mode='constant') first. Then loop over output positions (i, j), compute i_start = i*stride, j_start = j*stride, and extract the patch X_pad[i_start:i_start+kH, j_start:j_start+kW]. The output value is np.sum(patch * kernel).",
    starterCode: `import numpy as np

def conv2d(X, kernel, stride=1, padding=0):
    """
    2D cross-correlation (convolution without kernel flip).

    Args:
        X:       np.ndarray shape (H, W) — input image
        kernel:  np.ndarray shape (kH, kW) — convolutional filter
        stride:  int — step size
        padding: int — zero-padding on each side
    Returns:
        out: np.ndarray shape (out_H, out_W)
    """
    # TODO: Pad input, then slide the kernel over every valid position
    pass`,
    solution: `import numpy as np

def conv2d(X, kernel, stride=1, padding=0):
    H, W   = X.shape
    kH, kW = kernel.shape

    # Zero-pad the input
    X_pad = np.pad(X, padding, mode="constant")

    out_H = (H + 2 * padding - kH) // stride + 1
    out_W = (W + 2 * padding - kW) // stride + 1

    out = np.zeros((out_H, out_W))

    for i in range(out_H):
        for j in range(out_W):
            i_start = i * stride
            j_start = j * stride
            patch = X_pad[i_start:i_start + kH, j_start:j_start + kW]
            out[i, j] = np.sum(patch * kernel)

    return out`,
    explanation:
      "This implements cross-correlation (what deep learning libraries call 'convolution' — strictly, true convolution flips the kernel, but the distinction rarely matters in practice). Padding with zeros allows the kernel to be applied at border positions, preserving spatial dimensions when padding = (kH-1)//2. The output size formula (H + 2P - kH) // S + 1 assumes integer division. Each output element requires kH*kW multiplications and additions, giving total complexity O(out_H * out_W * kH * kW). Production implementations use im2col to convert this to a matrix multiplication, enabling GPU acceleration via highly optimized BLAS routines.",
    testCases: `import numpy as np

# Test 1: Identity kernel (single 1 in center)
X = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]], dtype=float)
kernel_id = np.array([[0, 0, 0],
                       [0, 1, 0],
                       [0, 0, 0]], dtype=float)
out = conv2d(X, kernel_id, stride=1, padding=1)
assert out.shape == (3, 3)
assert np.allclose(out, X)

# Test 2: Sum kernel (box filter)
kernel_sum = np.ones((2, 2))
out2 = conv2d(X, kernel_sum)
assert out2.shape == (2, 2)
assert out2[0, 0] == 12.0   # 1+2+4+5
assert out2[1, 1] == 28.0   # 5+6+8+9

# Test 3: Edge detection (Sobel-like)
kernel_edge = np.array([[-1, 0, 1],
                         [-2, 0, 2],
                         [-1, 0, 1]], dtype=float)
out3 = conv2d(X, kernel_edge, padding=1)
assert out3.shape == (3, 3)

# Test 4: Stride=2
out4 = conv2d(X, np.ones((2,2)), stride=2)
assert out4.shape == (1, 1)
assert out4[0, 0] == 12.0

# Test 5: Output shape formula
H, W, kH, kW, P, S = 10, 10, 3, 3, 0, 1
X_big = np.random.randn(H, W)
k_big = np.random.randn(kH, kW)
out5 = conv2d(X_big, k_big, stride=S, padding=P)
expected_H = (H + 2*P - kH) // S + 1
assert out5.shape == (expected_H, expected_H)`,
    timeComplexity: "O(out_H * out_W * kH * kW)",
    spaceComplexity: "O(out_H * out_W) for output + O((H+2P)*(W+2P)) for padded input",
  },

  {
    id: "numpy-016",
    type: "knowledge",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "standard",
    title: "Einsum Mastery",
    tags: ["einsum", "einstein-summation", "matmul", "trace", "outer-product", "batch-matmul"],
    question:
      "Express each of the following five operations using `np.einsum`. Write the einsum string and the function call.\n\n1. **Matrix multiplication**: C = A @ B where A:(m,k), B:(k,n) → C:(m,n)\n2. **Trace** of a square matrix A:(n,n) → scalar\n3. **Outer product**: u:(m,) and v:(n,) → M:(m,n)\n4. **Batch matrix multiply**: A:(batch,m,k) and B:(batch,k,n) → C:(batch,m,n)\n5. **Transpose** of A:(m,n) → A.T:(n,m)",
    format: "short-answer",
    correctAnswer:
      "1. np.einsum('mk,kn->mn', A, B)\n2. np.einsum('ii->', A)\n3. np.einsum('m,n->mn', u, v)\n4. np.einsum('bmk,bkn->bmn', A, B)\n5. np.einsum('mn->nm', A)",
    explanation:
      "Einsum notation works by labeling each dimension with a letter. Repeated indices are summed over (contracted). Output indices that appear define the output shape. Missing indices in output → summed out.\n\n1. **Matmul** `'mk,kn->mn'`: k appears in both inputs but not output → summed over. Produces (m,n).\n2. **Trace** `'ii->'`: Both dimensions of A share index i (the diagonal). No output index → reduces to scalar.\n3. **Outer product** `'m,n->mn'`: No shared indices → no contraction. All input indices kept → outer product.\n4. **Batch matmul** `'bmk,bkn->bmn'`: b is shared and kept (batch dim is NOT contracted). k is shared and absent from output → contracted.\n5. **Transpose** `'mn->nm'`: Same indices, just reordered in output → transpose.\n\nEinsum is powerful for expressing arbitrary tensor contractions clearly and efficiently. NumPy (and PyTorch/JAX) optimize einsum paths automatically for large operations.",
  },

  {
    id: "numpy-017",
    type: "knowledge",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "core",
    title: "Numerical Precision Pitfalls",
    tags: ["float32", "float64", "numerical-precision", "catastrophic-cancellation", "dtype"],
    question:
      "A colleague runs the following code and is surprised by the result:\n```python\nimport numpy as np\na = np.float32(1e8)\nb = np.float32(1.0)\nprint(a + b - a)   # expected 1.0, got 0.0\n\na64 = np.float64(1e8)\nb64 = np.float64(1.0)\nprint(a64 + b64 - a64)  # prints 1.0 correctly\n```\n\nWhich statement **best** explains this behavior and gives the correct practical guidance?",
    format: "multiple-choice",
    options: [
      {
        id: "A",
        text: "float32 has ~7 decimal digits of precision. 1e8 requires 9 digits, so adding 1.0 is below the precision threshold and is rounded away. Use float64 (~15 digits) when summing values of very different magnitudes or when accumulating many small values.",
      },
      {
        id: "B",
        text: "float32 overflows for values above 1e7, so 1e8 is stored as infinity. The subtraction inf - inf = NaN, which prints as 0.0 in NumPy. Always use float64 to avoid overflow.",
      },
      {
        id: "C",
        text: "This is a NumPy bug — Python floats are always float64 and this would work correctly. Use np.float64 explicitly to get correct behavior.",
      },
      {
        id: "D",
        text: "float32 rounds all arithmetic to 6 significant figures, and 1e8 rounded to 6 figures is exactly 100000000. Adding 1.0 gives 100000001, which rounds back to 100000000, so the subtraction gives 0. Use Decimal for exact arithmetic.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "float32 uses 23 bits for the mantissa, giving approximately 7 significant decimal digits of precision. The number 1e8 = 100,000,000 uses all 9 of those significant digits just to represent itself. When you add 1.0, the result 100,000,001.0 would require 10 significant digits — beyond float32 capacity — so the 1.0 is rounded away during the addition. The subsequent subtraction of 1e8 then gives 0.0 instead of 1.0.\n\nThis is **catastrophic cancellation** — when subtracting two nearly-equal numbers, relative error magnifies dramatically.\n\n**Practical guidance:**\n- Use float64 (default in NumPy) for accumulation loops and sums of large arrays\n- Use float32 in neural networks for speed/memory — gradients are small relative to weights, so precision loss is less harmful\n- Use `np.float64(x).sum()` or `dtype=np.float64` for numerical stability in scientific computing\n- Kahan summation algorithm can improve float32 summation accuracy significantly\n- float32 max is ~3.4e38, so overflow is not the issue here — precision is",
  },

  {
    id: "numpy-018",
    type: "coding",
    category: "numpy-fundamentals",
    categoryLabel: "NumPy Fundamentals",
    difficulty: "standard",
    title: "Implement Mini-Batch SGD Training Loop",
    tags: ["SGD", "mini-batch", "training-loop", "forward-pass", "backward-pass", "gradient-descent"],
    question:
      "Implement a complete **mini-batch SGD training loop** for linear regression using only NumPy.\n\nGiven:\n- X_train: shape (n, d) — features\n- y_train: shape (n,) — targets\n- Initial weights W: shape (d,), bias b: scalar\n- Learning rate, batch size, number of epochs\n\nAlgorithm per epoch:\n1. **Shuffle** the training data\n2. **Split into mini-batches** of size `batch_size`\n3. For each batch:\n   a. **Forward**: `y_pred = X_batch @ W + b`\n   b. **Loss**: MSE = `mean((y_pred - y_batch)^2)`\n   c. **Backward**: compute `dW` and `db`\n   d. **Update**: `W -= lr * dW`, `b -= lr * db`\n4. Track and return the mean loss per epoch\n\nMSE gradients:\n```\ndW = (2/n_batch) * X_batch.T @ (y_pred - y_batch)\ndb = (2/n_batch) * sum(y_pred - y_batch)\n```\n\nImplement `mini_batch_sgd(X, y, W, b, lr, batch_size, epochs)` returning `(W, b, loss_history)`.",
    hint: "Shuffle with a permutation: idx = np.random.permutation(n); X = X[idx]; y = y[idx]. Split with np.array_split or manual slicing. The MSE gradient dW = 2/n * X.T @ error where error = y_pred - y. Track loss_history as a list of per-epoch mean MSE.",
    starterCode: `import numpy as np

def mini_batch_sgd(X, y, W, b, lr=0.01, batch_size=32, epochs=100):
    """
    Mini-batch SGD for linear regression.

    Args:
        X:          np.ndarray shape (n, d) — features
        y:          np.ndarray shape (n,)   — targets
        W:          np.ndarray shape (d,)   — initial weights (modified in-place)
        b:          float                   — initial bias
        lr:         float — learning rate
        batch_size: int   — mini-batch size
        epochs:     int   — number of passes over data
    Returns:
        W:            np.ndarray shape (d,) — final weights
        b:            float                 — final bias
        loss_history: list of float         — mean MSE per epoch
    """
    # TODO: Shuffle → split → forward → loss → backward → update; track loss
    pass`,
    solution: `import numpy as np

def mini_batch_sgd(X, y, W, b, lr=0.01, batch_size=32, epochs=100):
    W = W.copy()  # avoid mutating the caller's array
    n, d = X.shape
    loss_history = []

    for epoch in range(epochs):
        # Shuffle
        idx = np.random.permutation(n)
        X_shuf = X[idx]
        y_shuf = y[idx]

        epoch_losses = []

        for start in range(0, n, batch_size):
            X_batch = X_shuf[start:start + batch_size]
            y_batch = y_shuf[start:start + batch_size]
            n_batch = len(y_batch)

            # Forward
            y_pred = X_batch @ W + b

            # Loss (MSE)
            error = y_pred - y_batch
            loss  = np.mean(error ** 2)
            epoch_losses.append(loss)

            # Backward
            dW = (2.0 / n_batch) * X_batch.T @ error
            db = (2.0 / n_batch) * error.sum()

            # Update
            W -= lr * dW
            b -= lr * db

        loss_history.append(float(np.mean(epoch_losses)))

    return W, b, loss_history`,
    explanation:
      "Shuffling before each epoch breaks correlations between consecutive samples — critical for SGD to work well. Mini-batching balances the noise of true SGD (batch_size=1) against the cost of full-batch gradient descent: mini-batches provide a noisy but unbiased estimate of the full gradient. The MSE gradient dW = (2/n) * X.T @ error comes from differentiating mean((Xw+b-y)^2) w.r.t. w using the chain rule. Copying W at the start prevents mutating the caller's array. Tracking per-epoch average loss allows monitoring convergence. In practice, the learning rate is the most sensitive hyperparameter: too large → divergence; too small → slow convergence.",
    testCases: `import numpy as np
np.random.seed(42)

# Generate a simple linear dataset: y = 2*x1 + 3*x2 + 1 + noise
n, d = 200, 2
X = np.random.randn(n, d)
true_W = np.array([2.0, 3.0])
true_b = 1.0
y = X @ true_W + true_b + 0.1 * np.random.randn(n)

# Initialize
W_init = np.zeros(d)
b_init = 0.0

W_final, b_final, losses = mini_batch_sgd(
    X, y, W_init, b_init, lr=0.05, batch_size=32, epochs=200
)

# Loss should decrease
assert losses[0] > losses[-1], "Loss should decrease over training"

# Final weights should be close to true weights
assert np.allclose(W_final, true_W, atol=0.2), f"W={W_final}, expected~{true_W}"
assert np.isclose(b_final, true_b, atol=0.2), f"b={b_final}, expected~{true_b}"

# loss_history length
assert len(losses) == 200

# All losses are positive
assert all(l >= 0 for l in losses)`,
    timeComplexity: "O(epochs * n * d) — linear in all dimensions",
    spaceComplexity: "O(n * d) for shuffled copies + O(d) for weights",
  },
];

export default numpyFundamentals;
