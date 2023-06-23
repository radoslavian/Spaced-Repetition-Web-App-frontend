export default function LearningProgress(
    {scheduled = 0, cramQueue=0, queued=0}) {
    return(
        <span id="learning-progress-indicator">
          Scheduled: {scheduled} Cram: {cramQueue} Queued: {queued}
        </span>
    );
}
