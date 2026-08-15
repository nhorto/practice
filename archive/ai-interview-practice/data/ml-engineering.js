const mlEngineering = [
  // ── Coding ──────────────────────────────────────────────────────────────
  {
    id: "mle-001",
    type: "coding",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "standard",
    title: "Evaluation Harness",
    tags: ["evaluation", "metrics", "inference", "reporting"],
    question:
      "Build an evaluation harness that loads a dataset, runs model inference on each example, computes standard classification metrics (accuracy, precision, recall, F1), and generates a summary report. The harness should support batched inference and handle edge cases like empty predictions or mismatched label sets.",
    hint: "Use sklearn.metrics for the heavy lifting. Focus on clean separation between data loading, inference, metric computation, and report generation so each stage is independently testable.",
    starterCode: `import json
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class EvalResult:
    """Stores evaluation results for a single run."""
    accuracy: float = 0.0
    precision: float = 0.0
    recall: float = 0.0
    f1: float = 0.0
    num_examples: int = 0
    predictions: list = field(default_factory=list)
    labels: list = field(default_factory=list)


def load_dataset(path: str) -> list[dict]:
    """Load a JSON-lines dataset. Each line has 'input' and 'label' keys."""
    # TODO: implement
    pass


def run_inference(
    examples: list[dict],
    model_fn: Callable[[list[str]], list[str]],
    batch_size: int = 32,
) -> list[str]:
    """Run batched inference over examples using model_fn.

    Args:
        examples: list of dicts with an 'input' key
        model_fn: function that takes a list of input strings and returns predictions
        batch_size: number of examples per batch

    Returns:
        List of prediction strings, one per example.
    """
    # TODO: implement batched inference
    pass


def compute_metrics(labels: list[str], predictions: list[str]) -> EvalResult:
    """Compute accuracy, precision, recall, and F1 from labels and predictions.

    Handle edge cases:
      - Empty lists should return zeroed metrics
      - Mismatched lengths should raise ValueError
    """
    # TODO: implement
    pass


def generate_report(result: EvalResult) -> str:
    """Return a formatted string report of the evaluation results."""
    # TODO: implement
    pass


def evaluate(
    dataset_path: str,
    model_fn: Callable[[list[str]], list[str]],
    batch_size: int = 32,
) -> str:
    """End-to-end evaluation: load data -> inference -> metrics -> report."""
    # TODO: implement by composing the functions above
    pass
`,
    solution: `import json
from dataclasses import dataclass, field
from typing import Any, Callable
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score


@dataclass
class EvalResult:
    accuracy: float = 0.0
    precision: float = 0.0
    recall: float = 0.0
    f1: float = 0.0
    num_examples: int = 0
    predictions: list = field(default_factory=list)
    labels: list = field(default_factory=list)


def load_dataset(path: str) -> list[dict]:
    examples = []
    with open(path, "r") as f:
        for line in f:
            line = line.strip()
            if line:
                examples.append(json.loads(line))
    return examples


def run_inference(
    examples: list[dict],
    model_fn: Callable[[list[str]], list[str]],
    batch_size: int = 32,
) -> list[str]:
    predictions = []
    inputs = [ex["input"] for ex in examples]
    for i in range(0, len(inputs), batch_size):
        batch = inputs[i : i + batch_size]
        preds = model_fn(batch)
        predictions.extend(preds)
    return predictions


def compute_metrics(labels: list[str], predictions: list[str]) -> EvalResult:
    if len(labels) != len(predictions):
        raise ValueError(
            f"Length mismatch: {len(labels)} labels vs {len(predictions)} predictions"
        )
    if len(labels) == 0:
        return EvalResult(num_examples=0, predictions=[], labels=[])

    return EvalResult(
        accuracy=accuracy_score(labels, predictions),
        precision=precision_score(labels, predictions, average="weighted", zero_division=0),
        recall=recall_score(labels, predictions, average="weighted", zero_division=0),
        f1=f1_score(labels, predictions, average="weighted", zero_division=0),
        num_examples=len(labels),
        predictions=predictions,
        labels=labels,
    )


def generate_report(result: EvalResult) -> str:
    lines = [
        "===== Evaluation Report =====",
        f"Examples evaluated : {result.num_examples}",
        f"Accuracy           : {result.accuracy:.4f}",
        f"Precision (weighted): {result.precision:.4f}",
        f"Recall (weighted)   : {result.recall:.4f}",
        f"F1 (weighted)       : {result.f1:.4f}",
        "=============================",
    ]
    return "\\n".join(lines)


def evaluate(
    dataset_path: str,
    model_fn: Callable[[list[str]], list[str]],
    batch_size: int = 32,
) -> str:
    examples = load_dataset(dataset_path)
    labels = [ex["label"] for ex in examples]
    predictions = run_inference(examples, model_fn, batch_size)
    result = compute_metrics(labels, predictions)
    return generate_report(result)
`,
    explanation:
      "A well-structured evaluation harness cleanly separates concerns: data loading, inference, metric computation, and reporting. Batched inference prevents OOM on large datasets. Using weighted averaging for precision/recall/F1 handles class imbalance gracefully. Edge-case handling (empty inputs, length mismatches) makes the harness production-ready.",
    testCases: [
      {
        input: "compute_metrics(['a','b','a'], ['a','b','b'])",
        expected: "EvalResult with accuracy ~0.6667, num_examples=3",
      },
      {
        input: "compute_metrics([], [])",
        expected: "EvalResult with all zeros and num_examples=0",
      },
      {
        input: "compute_metrics(['a'], ['a','b'])",
        expected: "Raises ValueError for length mismatch",
      },
      {
        input: "run_inference with batch_size=2 on 5 examples",
        expected: "3 batches processed (2, 2, 1), 5 predictions returned",
      },
    ],
    timeComplexity: "O(n) for inference and metrics where n is dataset size",
    spaceComplexity: "O(n) to store all predictions and labels",
  },
  {
    id: "mle-002",
    type: "coding",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "standard",
    title: "Feature Store Point-in-Time Join",
    tags: ["feature-store", "temporal-join", "data-leakage", "pandas"],
    question:
      "Implement a point-in-time join that merges entity features onto a spine (events table) while strictly preventing data leakage. For each event row, only features that were available *before* the event timestamp should be joined. This is the core primitive in any feature store.",
    hint: "Sort both tables by timestamp, then use pandas merge_asof with direction='backward' to pick the most recent feature row that does not exceed the event time. Be careful with the tolerance parameter and handle entities with no prior features.",
    starterCode: `import pandas as pd
from typing import Optional


def point_in_time_join(
    spine: pd.DataFrame,
    features: pd.DataFrame,
    entity_col: str,
    spine_ts_col: str = "event_timestamp",
    feature_ts_col: str = "feature_timestamp",
    tolerance: Optional[pd.Timedelta] = None,
) -> pd.DataFrame:
    """Perform a point-in-time correct join.

    Args:
        spine: Events DataFrame with entity_col and spine_ts_col columns.
        features: Features DataFrame with entity_col, feature_ts_col,
                  and one or more feature value columns.
        entity_col: Column name for the entity key (e.g. 'user_id').
        spine_ts_col: Timestamp column in the spine.
        feature_ts_col: Timestamp column in the features table.
        tolerance: Optional max lookback window. Features older than this
                   relative to the event are excluded.

    Returns:
        The spine DataFrame with feature columns joined. Rows with no
        matching feature should have NaN for feature columns.
    """
    # TODO: implement point-in-time join
    pass


def validate_no_leakage(
    result: pd.DataFrame,
    spine_ts_col: str = "event_timestamp",
    feature_ts_col: str = "feature_timestamp",
) -> bool:
    """Return True if no feature timestamp exceeds its event timestamp."""
    # TODO: implement validation
    pass
`,
    solution: `import pandas as pd
from typing import Optional


def point_in_time_join(
    spine: pd.DataFrame,
    features: pd.DataFrame,
    entity_col: str,
    spine_ts_col: str = "event_timestamp",
    feature_ts_col: str = "feature_timestamp",
    tolerance: Optional[pd.Timedelta] = None,
) -> pd.DataFrame:
    spine = spine.copy()
    features = features.copy()

    # Ensure timestamps are datetime
    spine[spine_ts_col] = pd.to_datetime(spine[spine_ts_col])
    features[feature_ts_col] = pd.to_datetime(features[feature_ts_col])

    # Sort by timestamp (required by merge_asof)
    spine = spine.sort_values(spine_ts_col)
    features = features.sort_values(feature_ts_col)

    result = pd.merge_asof(
        spine,
        features,
        left_on=spine_ts_col,
        right_on=feature_ts_col,
        by=entity_col,
        direction="backward",
        tolerance=tolerance,
    )

    return result


def validate_no_leakage(
    result: pd.DataFrame,
    spine_ts_col: str = "event_timestamp",
    feature_ts_col: str = "feature_timestamp",
) -> bool:
    matched = result.dropna(subset=[feature_ts_col])
    if matched.empty:
        return True
    return (matched[feature_ts_col] <= matched[spine_ts_col]).all()
`,
    explanation:
      "Point-in-time joins are the backbone of feature stores. The key insight is that at prediction time you only have access to features computed *before* the prediction moment. Using merge_asof with direction='backward' efficiently finds the most recent feature row per entity that does not exceed the event timestamp. The tolerance parameter adds a max-staleness window so very old features are dropped. Validating the result ensures no future data leaked in.",
    testCases: [
      {
        input: "Event at 10:00, features at 09:00 and 11:00",
        expected: "Joins the 09:00 feature, not the 11:00 feature",
      },
      {
        input: "Event at 10:00, no features before 10:00",
        expected: "Feature columns are NaN",
      },
      {
        input: "Event at 10:00, feature at 09:00, tolerance=30min",
        expected: "Joins the 09:00 feature (within tolerance)",
      },
      {
        input: "Event at 10:00, feature at 08:00, tolerance=30min",
        expected: "Feature columns are NaN (outside tolerance)",
      },
    ],
    timeComplexity: "O(n log n) dominated by sorting; merge_asof is O(n+m)",
    spaceComplexity: "O(n + m) for copies of both DataFrames",
  },

  // ── Knowledge ───────────────────────────────────────────────────────────
  {
    id: "mle-003",
    type: "knowledge",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "core",
    title: "Experiment Tracking Components",
    tags: ["experiment-tracking", "mlops", "reproducibility"],
    question:
      "Which of the following is NOT typically a core component of an experiment tracking system?",
    format: "multiple-choice",
    options: [
      { id: "A", text: "Hyperparameter logging" },
      { id: "B", text: "Metric visualization over training steps" },
      { id: "C", text: "Automatic GPU cluster provisioning" },
      { id: "D", text: "Artifact versioning (model checkpoints, datasets)" },
    ],
    correctAnswer: "C",
    explanation:
      "Experiment tracking systems (e.g., MLflow, Weights & Biases, Neptune) focus on recording what happened during a run: hyperparameters, metrics over time, and artifacts like checkpoints and datasets. Automatic GPU cluster provisioning is an infrastructure/orchestration concern handled by tools like Kubernetes, Ray, or cloud-specific services -- not the experiment tracker itself. While some platforms bundle both, provisioning is not a core tracking component.",
  },
  {
    id: "mle-004",
    type: "knowledge",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "standard",
    title: "Data Pipeline Idempotency",
    tags: ["data-pipelines", "idempotency", "etl", "reliability"],
    question:
      "Explain why idempotency is important in data pipelines and describe two concrete techniques to achieve it.",
    format: "short-answer",
    correctAnswer:
      "Idempotency ensures that re-running a pipeline step produces the same result, which is critical because pipelines frequently need retries after partial failures. Without idempotency, retries can cause duplicated rows, double-counted metrics, or corrupted state.\n\nTechnique 1: Write-Replace (atomic overwrite) -- Write output to a temporary location and atomically swap it into the final path. If the step reruns, it overwrites with the same data rather than appending.\n\nTechnique 2: Deterministic deduplication keys -- Assign each record a deterministic unique ID (e.g., hash of natural key + event timestamp). On write, use UPSERT / MERGE semantics so duplicate inserts are no-ops.",
    explanation:
      "Data pipelines fail regularly due to network issues, OOM, timeouts, and upstream schema changes. Orchestrators like Airflow retry failed tasks automatically. If a task is not idempotent, a retry after a partial write can corrupt downstream data. Atomic writes and deduplication keys are the two most common and practical techniques to guarantee safe retries.",
  },
  {
    id: "mle-005",
    type: "knowledge",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "standard",
    title: "Model Deployment Rollback Debugging",
    tags: ["deployment", "rollback", "debugging", "monitoring"],
    question:
      "A freshly deployed model is causing a spike in latency and a drop in business metrics. Describe the steps you would take to diagnose the issue and safely roll back.",
    format: "short-answer",
    correctAnswer:
      "1. Confirm the regression: Check dashboards for latency p50/p95/p99, error rates, and business KPIs. Correlate the timing with the deployment event.\n\n2. Triage severity: If the impact is critical (e.g., revenue loss, user-facing errors), initiate rollback immediately before root-causing.\n\n3. Rollback: Switch traffic back to the previous model version using your serving infrastructure's version routing (e.g., update the model alias in a model registry, shift traffic in a load balancer, or redeploy the prior container image).\n\n4. Verify recovery: Confirm metrics return to baseline after rollback.\n\n5. Root-cause analysis: Compare the new model's artifacts, config, and dependencies against the old version. Common culprits include training/serving skew, feature pipeline regressions, changed preprocessing, or resource misconfiguration (wrong instance type causing OOM/throttling).\n\n6. Fix and re-validate: Reproduce the issue in a staging environment, fix, and run canary deployment before re-promoting.",
    explanation:
      "Speed of rollback is paramount -- every minute a bad model is in production costs real money or user trust. Having automated rollback mechanisms (blue-green deploys, canary routing, model registry aliases) is essential. Root-cause analysis should happen after the rollback, not before, unless the impact is very minor.",
  },

  // ── Open-Ended ──────────────────────────────────────────────────────────
  {
    id: "mle-006",
    type: "open-ended",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "standard",
    title: "Training Data Pipeline with Leak Prevention",
    tags: ["data-pipeline", "data-leakage", "train-test-split", "feature-engineering"],
    question:
      "Design a training data pipeline that preprocesses raw event logs into ML-ready features while rigorously preventing train/test data leakage. Cover the splitting strategy, feature computation, and validation checks.",
    context:
      "You have a table of user-level events with timestamps (clicks, purchases, page views). You need to build features like '7-day purchase count' and 'average session duration' for a churn prediction model. The model will be retrained monthly.",
    rubric: [
      "Defines a temporal split strategy (not random) based on a cutoff date",
      "Computes features using only data available before each label window",
      "Addresses entity-level leakage (same user in train and test is OK only with temporal split)",
      "Includes validation checks (e.g., assert no future data in features)",
      "Considers feature freshness and pipeline scheduling",
    ],
    sampleAnswer:
      "Split by time: use the most recent month as the test set and prior months as training. For each observation, define a label window (e.g., 'did the user churn in the 30 days after the cutoff?') and a feature window (e.g., the 90 days before the cutoff). Compute all features strictly within the feature window -- never let the feature window overlap the label window. Use a point-in-time join (merge_asof) to attach features to each entity-cutoff pair. Add automated assertions: for every row, assert feature_timestamp < cutoff_date. For monthly retraining, parameterize the cutoff date so the pipeline is rerunnable. Store features in a feature store with timestamps so downstream consumers always get point-in-time correct values.",
    keyPoints: [
      "Temporal splitting prevents future information from leaking into training data",
      "Feature windows must be strictly before the label window with no overlap",
      "Point-in-time joins are the standard mechanism for leak-free feature attachment",
      "Automated assertions catch leakage regressions as the pipeline evolves",
      "Parameterized cutoff dates enable reproducible, scheduled retraining",
    ],
  },
  {
    id: "mle-007",
    type: "open-ended",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "stretch",
    title: "Train-Register-Deploy Pipeline",
    tags: ["mlops", "ci-cd", "model-registry", "deployment", "pipeline"],
    question:
      "Design an end-to-end MLOps pipeline that trains a model, registers it in a model registry, runs validation gates, and deploys it to production with a safe rollout strategy. Include the CI/CD integration points.",
    context:
      "Your team ships a recommendation model that serves 10M+ requests/day. Training runs nightly. You need to balance velocity (ship improvements fast) with safety (never degrade the user experience).",
    rubric: [
      "Covers the full lifecycle: data prep, training, evaluation, registration, deployment",
      "Includes a model registry with versioning and stage transitions (staging -> production)",
      "Defines automated quality gates (metric thresholds, data drift checks)",
      "Describes a safe rollout strategy (canary, shadow, blue-green)",
      "Addresses monitoring, alerting, and automated rollback",
      "Mentions CI/CD integration (trigger on code merge, artifact promotion)",
    ],
    sampleAnswer:
      "The pipeline has four stages. (1) Training: triggered nightly by an orchestrator (Airflow/Kubeflow). Pulls latest data, trains the model, logs metrics and artifacts to the experiment tracker. (2) Validation gate: compares the new model against the current production model on a held-out golden set. If accuracy drops below a threshold or data-drift score is high, the pipeline halts and alerts the team. (3) Registration: on passing validation, the model is registered in a model registry (MLflow/Vertex) with metadata (commit SHA, dataset version, metrics). The model is promoted to 'staging'. (4) Deployment: a CD pipeline deploys the staging model behind a canary -- 5% of traffic for 1 hour. If latency and business metrics hold, traffic ramps to 100%. If any alert fires, traffic auto-routes back to the previous version. CI integration: a code merge triggers a training run with the new code on a subset of data as a smoke test; the nightly job uses the full dataset.",
    keyPoints: [
      "Nightly orchestrated training with experiment tracking",
      "Automated quality gates comparing new vs. current production model",
      "Model registry with versioned artifacts and stage transitions",
      "Canary deployment with automated rollback on metric degradation",
      "CI smoke tests on code merge to catch breakage early",
      "End-to-end lineage: code commit -> dataset version -> model artifact -> deployment",
    ],
  },
  {
    id: "mle-008",
    type: "open-ended",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "standard",
    title: "CTR Drop Incident Response",
    tags: ["debugging", "production", "monitoring", "incident-response", "ctr"],
    question:
      "Your production recommendation model's click-through rate (CTR) dropped 15% overnight. Walk through how you would diagnose and resolve this incident.",
    context:
      "The model was last retrained 3 days ago with no code changes since. The drop appeared suddenly this morning. You have access to serving logs, feature pipelines, model registry, and dashboards.",
    rubric: [
      "Starts with impact assessment and triage (is it real? how severe?)",
      "Checks for upstream data pipeline failures or schema changes",
      "Investigates feature distribution drift",
      "Considers external factors (seasonality, UI changes, A/B test interference)",
      "Proposes both immediate mitigation and long-term prevention",
    ],
    sampleAnswer:
      "Step 1 - Verify: Confirm the CTR drop is real and not a logging/tracking bug (check impression counts, click event ingestion, dashboard queries). Segment by platform, region, and user cohort to understand the blast radius.\n\nStep 2 - Correlate: Check if anything changed overnight: deployment events, feature pipeline runs, upstream data source updates, A/B test launches, UI/UX deploys. Even without a model redeploy, a feature pipeline could have broken.\n\nStep 3 - Data investigation: Compare today's feature distributions against the prior week. Look for null spikes, cardinality changes, or value range shifts in key features. A common cause is an upstream table being stale or a schema migration dropping a column, which silently fills features with defaults.\n\nStep 4 - Immediate mitigation: If a broken feature is identified, either fix the pipeline or fall back to a cached/stale feature version. If the root cause is unclear, consider rolling back to a model trained on a known-good feature snapshot.\n\nStep 5 - Long-term fixes: Add feature distribution monitoring with alerts (Great Expectations, whylogs). Implement feature freshness checks that block serving if features are stale beyond a threshold. Add integration tests for the critical path from raw data to model input.",
    keyPoints: [
      "Always verify the metric drop is real before investigating model issues",
      "Feature pipeline failures are the most common cause of sudden model degradation",
      "Segment the impact to narrow down the root cause",
      "Immediate mitigation (rollback, feature fallback) takes priority over root-cause analysis",
      "Long-term prevention requires feature monitoring, freshness checks, and integration tests",
    ],
  },
  {
    id: "mle-009",
    type: "coding",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "standard",
    title: "SQL for ML Feature Extraction",
    tags: ["sql", "feature-engineering", "window-functions"],
    question:
      "Write SQL queries to compute ML features from a user events table. Implement: (1) a window function query that computes per-user session metrics (session count, avg session duration, pages per session) over the last 30 days, (2) an aggregation query that computes purchase behavior features (purchase count, total spend, avg order value, days since last purchase), and (3) a join query that combines behavioral signals from multiple tables (events, orders, user_profile) into a single feature row per user.",
    hint: "Use LAG/LEAD for session boundary detection. A session gap is typically defined as >30 minutes between events. Use CASE WHEN inside aggregations for conditional counts. CTE chaining keeps complex queries readable.",
    starterCode: `-- Events table schema:
-- user_events(user_id, event_type, page_url, event_ts)
-- orders(user_id, order_id, amount, created_at)
-- user_profile(user_id, signup_date, country, plan_tier)

-- Query 1: Session metrics using window functions
-- A new session starts when the gap from the previous event is > 30 minutes.
-- Compute: session_count, avg_session_duration_seconds, avg_pages_per_session
-- for the last 30 days, one row per user.

-- TODO: Write Query 1 here


-- Query 2: Purchase behavior aggregations
-- Compute: purchase_count, total_spend, avg_order_value, days_since_last_purchase
-- for the last 90 days, one row per user.

-- TODO: Write Query 2 here


-- Query 3: Combined feature join
-- Join sessions (Query 1), purchase (Query 2), and user_profile
-- to produce one feature row per user.

-- TODO: Write Query 3 here
`,
    solution: `-- Query 1: Session metrics
WITH event_gaps AS (
  SELECT
    user_id,
    event_ts,
    LAG(event_ts) OVER (PARTITION BY user_id ORDER BY event_ts) AS prev_event_ts
  FROM user_events
  WHERE event_ts >= NOW() - INTERVAL '30 days'
),
session_starts AS (
  SELECT
    user_id,
    event_ts,
    CASE
      WHEN prev_event_ts IS NULL
        OR EXTRACT(EPOCH FROM (event_ts - prev_event_ts)) > 1800 THEN 1
      ELSE 0
    END AS is_session_start
  FROM event_gaps
),
session_ids AS (
  SELECT
    user_id,
    event_ts,
    SUM(is_session_start) OVER (PARTITION BY user_id ORDER BY event_ts) AS session_id
  FROM session_starts
),
session_stats AS (
  SELECT
    user_id,
    session_id,
    COUNT(*) AS pages_in_session,
    EXTRACT(EPOCH FROM (MAX(event_ts) - MIN(event_ts))) AS session_duration_sec
  FROM session_ids
  GROUP BY user_id, session_id
)
SELECT
  user_id,
  COUNT(*)                          AS session_count,
  AVG(session_duration_sec)         AS avg_session_duration_seconds,
  AVG(pages_in_session)             AS avg_pages_per_session
FROM session_stats
GROUP BY user_id;


-- Query 2: Purchase behavior aggregations
SELECT
  user_id,
  COUNT(order_id)                                          AS purchase_count,
  COALESCE(SUM(amount), 0)                                 AS total_spend,
  COALESCE(AVG(amount), 0)                                 AS avg_order_value,
  EXTRACT(DAY FROM (NOW() - MAX(created_at)))              AS days_since_last_purchase
FROM orders
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY user_id;


-- Query 3: Combined feature join
WITH session_features AS (
  -- ... (Query 1 CTE chain here, aliased as session_features)
  SELECT user_id, session_count, avg_session_duration_seconds, avg_pages_per_session
  FROM session_stats_result  -- assume Query 1 result materialized
),
purchase_features AS (
  SELECT
    user_id,
    COUNT(order_id)                                     AS purchase_count,
    COALESCE(SUM(amount), 0)                            AS total_spend,
    COALESCE(AVG(amount), 0)                            AS avg_order_value,
    EXTRACT(DAY FROM (NOW() - MAX(created_at)))         AS days_since_last_purchase
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '90 days'
  GROUP BY user_id
)
SELECT
  p.user_id,
  p.signup_date,
  p.country,
  p.plan_tier,
  COALESCE(s.session_count, 0)                AS session_count,
  COALESCE(s.avg_session_duration_seconds, 0) AS avg_session_duration_seconds,
  COALESCE(s.avg_pages_per_session, 0)        AS avg_pages_per_session,
  COALESCE(f.purchase_count, 0)               AS purchase_count,
  COALESCE(f.total_spend, 0)                  AS total_spend,
  COALESCE(f.avg_order_value, 0)              AS avg_order_value,
  f.days_since_last_purchase
FROM user_profile p
LEFT JOIN session_features s ON p.user_id = s.user_id
LEFT JOIN purchase_features f ON p.user_id = f.user_id;
`,
    explanation:
      "Window functions are essential for session detection because each event's session membership depends on the gap from its predecessor. The LAG pattern assigns session IDs without expensive self-joins. Aggregate features are straightforward but require COALESCE to handle users with no events/orders (NULL from LEFT JOIN becomes 0). The final LEFT JOIN from user_profile ensures all users appear in the output even with no behavioral history, which is critical for cold-start users in ML pipelines.",
    testCases: [
      {
        input: "User with events at 10:00, 10:15, 10:45, 11:30 (30-min gap threshold)",
        expected: "2 sessions: session 1 = events at 10:00 and 10:15, session 2 = events at 10:45 and 11:30",
      },
      {
        input: "User with no orders in the last 90 days",
        expected: "purchase_count=0, total_spend=0, avg_order_value=0, days_since_last_purchase=NULL",
      },
      {
        input: "User in user_profile with no rows in user_events or orders",
        expected: "Row appears in Query 3 output with all behavioral features as 0 (COALESCE handles NULLs)",
      },
    ],
    timeComplexity: "O(n log n) for window functions due to sorting by user_id and event_ts",
    spaceComplexity: "O(n) for intermediate CTE materializations",
  },
  {
    id: "mle-010",
    type: "coding",
    category: "ml-engineering",
    categoryLabel: "ML Engineering",
    difficulty: "stretch",
    title: "Production Python Async Inference Server",
    tags: ["fastapi", "async", "batching", "production"],
    question:
      "Implement an async FastAPI inference endpoint that collects incoming requests into dynamic batches and processes them together. Individual requests should wait up to `max_wait_ms` milliseconds for the batch to fill. Once the batch reaches `max_batch_size` OR the wait timeout expires, the batch is forwarded to the model for inference and each waiting request receives its individual result. Use asyncio primitives to coordinate the batching without busy-waiting.",
    hint: "Use an asyncio.Queue to collect requests. A background coroutine drains the queue when batch_size is met or a timeout fires. Each request should carry an asyncio.Future so the background task can set its result when inference completes. Use asyncio.wait_for with a timeout to implement max_wait_ms.",
    starterCode: `import asyncio
from dataclasses import dataclass, field
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

MAX_BATCH_SIZE = 32
MAX_WAIT_MS = 20


class InferenceRequest(BaseModel):
    inputs: list[float]


@dataclass
class PendingRequest:
    inputs: list[float]
    future: asyncio.Future = field(default_factory=asyncio.get_event_loop().create_future)


# TODO: Create a module-level queue and start a background batching task

async def model_inference(batch_inputs: list[list[float]]) -> list[Any]:
    """Simulate model inference. Replace with real model call."""
    # TODO: implement (for now, return sum of each input vector as a placeholder)
    pass


async def batch_processor():
    """Background task: collect requests and process them in batches."""
    # TODO: implement batching loop
    pass


@app.post("/predict")
async def predict(request: InferenceRequest):
    """Accept a single inference request, join the next batch, and return the result."""
    # TODO: enqueue the request, await its future, return the result
    pass


@app.on_event("startup")
async def startup():
    # TODO: start the batch_processor background task
    pass
`,
    solution: `import asyncio
from dataclasses import dataclass, field
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

MAX_BATCH_SIZE = 32
MAX_WAIT_MS = 20

request_queue: asyncio.Queue = asyncio.Queue()


class InferenceRequest(BaseModel):
    inputs: list[float]


@dataclass
class PendingRequest:
    inputs: list[float]
    future: asyncio.Future


async def model_inference(batch_inputs: list[list[float]]) -> list[Any]:
    """Simulate model inference — replace with real model forward pass."""
    await asyncio.sleep(0.001)  # simulate GPU latency
    return [sum(inputs) for inputs in batch_inputs]


async def batch_processor():
    """
    Background task: accumulate requests up to MAX_BATCH_SIZE or MAX_WAIT_MS,
    then run inference and resolve each request's future.
    """
    while True:
        pending: list[PendingRequest] = []

        # Block until at least one request arrives
        first = await request_queue.get()
        pending.append(first)

        # Drain the queue up to MAX_BATCH_SIZE with a timeout
        deadline = asyncio.get_event_loop().time() + MAX_WAIT_MS / 1000.0
        while len(pending) < MAX_BATCH_SIZE:
            remaining = deadline - asyncio.get_event_loop().time()
            if remaining <= 0:
                break
            try:
                item = await asyncio.wait_for(request_queue.get(), timeout=remaining)
                pending.append(item)
            except asyncio.TimeoutError:
                break

        # Run inference on the collected batch
        batch_inputs = [req.inputs for req in pending]
        try:
            results = await model_inference(batch_inputs)
            for req, result in zip(pending, results):
                if not req.future.done():
                    req.future.set_result(result)
        except Exception as exc:
            for req in pending:
                if not req.future.done():
                    req.future.set_exception(exc)


@app.post("/predict")
async def predict(request: InferenceRequest):
    loop = asyncio.get_event_loop()
    future: asyncio.Future = loop.create_future()
    pending = PendingRequest(inputs=request.inputs, future=future)
    await request_queue.put(pending)
    result = await future
    return {"result": result}


@app.on_event("startup")
async def startup():
    asyncio.create_task(batch_processor())
`,
    explanation:
      "Continuous batching is the key technique behind high-throughput ML inference servers (vLLM, TGI, Triton). The pattern: (1) each HTTP request deposits a PendingRequest with an asyncio.Future into a shared queue and then awaits that future, (2) a single background coroutine drains the queue using a timed wait — it blocks on the first item, then collects more items until either the batch is full or the deadline passes, (3) the background task runs inference on the full batch and resolves each future with the corresponding output. This gives near-optimal GPU utilization without requiring callers to manually batch their requests. The Future-based handoff avoids polling and keeps each request coroutine suspended (not consuming CPU) while waiting.",
    testCases: [
      {
        input: "32 concurrent POST /predict requests with identical inputs [1.0, 2.0, 3.0]",
        expected: "All 32 requests processed in a single inference call; each returns {result: 6.0}",
      },
      {
        input: "Single request with no other concurrent traffic",
        expected: "Request completes after max_wait_ms timeout; returns correct result",
      },
      {
        input: "20 requests arrive, then 15 more arrive 10ms later (max_wait_ms=20)",
        expected: "First 20 processed together after timeout; second 15 form their own batch",
      },
    ],
    timeComplexity: "O(B) per batch where B is batch size; individual request latency O(max_wait_ms + inference_time)",
    spaceComplexity: "O(B) for pending requests in the queue and batch buffer",
  },
];

export default mlEngineering;
