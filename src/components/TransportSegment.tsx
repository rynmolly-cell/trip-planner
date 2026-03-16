import type { TransportSegment as TransportSegmentType } from "../types/trip";
import styles from "./TransportSegment.module.css";

const DEFAULT_SEGMENT: TransportSegmentType = {
  type: "bus",
  description: "",
  required: true,
};

interface TransportSegmentProps {
  transport: TransportSegmentType;
  onChange?: (t: TransportSegmentType) => void;
  onRemove?: () => void;
  readOnly?: boolean;
}

const TRANSPORT_TYPES = [
  { value: "bus", label: "Bus" },
  { value: "train", label: "Train" },
  { value: "shuttle", label: "Shuttle" },
  { value: "other", label: "Other" },
] as const;

export function TransportSegment({
  transport,
  onChange,
  onRemove,
  readOnly = false,
}: TransportSegmentProps) {
  if (readOnly) {
    return (
      <div className={styles.readOnly}>
        <span className={styles.badge}>{transport.type}</span>
        <span>{transport.description}</span>
        {transport.url && (
          <a href={transport.url} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        )}
      </div>
    );
  }

  const handleChange =
    (field: keyof TransportSegmentType) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      onChange?.({
        ...transport,
        [field]: e.target.value,
      });
    };

  const handleRequired = () => {
    onChange?.({ ...transport, required: !transport.required });
  };

  return (
    <div className={styles.segment}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={transport.required}
          onChange={handleRequired}
        />
        <span>Required</span>
      </label>
      <select
        value={transport.type}
        onChange={handleChange("type")}
        className={styles.select}
      >
        {TRANSPORT_TYPES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={transport.description}
        onChange={handleChange("description")}
        placeholder="e.g. Bus Te Anau to Milford - book in advance"
        className={styles.input}
      />
      <input
        type="url"
        value={transport.url ?? ""}
        onChange={handleChange("url")}
        placeholder="Booking URL (optional)"
        className={styles.input}
      />
      {onRemove && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemove}
          aria-label="Remove transport"
        >
          ×
        </button>
      )}
    </div>
  );
}

interface TransportSegmentEditorProps {
  transport: TransportSegmentType[];
  onChange: (transport: TransportSegmentType[]) => void;
}

export default function TransportSegmentEditor({
  transport,
  onChange,
}: TransportSegmentEditorProps) {
  const add = () => {
    onChange([...transport, { ...DEFAULT_SEGMENT }]);
  };
  const update = (i: number, seg: TransportSegmentType) => {
    onChange(
      transport.map((s, idx) => (idx === i ? seg : s))
    );
  };
  const remove = (i: number) => {
    onChange(transport.filter((_, idx) => idx !== i));
  };
  return (
    <div className={styles.editor}>
      <span className={styles.editorLabel}>Transport between huts</span>
      {(transport ?? []).map((seg, i) => (
        <TransportSegment
          key={i}
          transport={seg}
          onChange={(s) => update(i, s)}
          onRemove={transport.length > 0 ? () => remove(i) : undefined}
        />
      ))}
      <button type="button" className={styles.addTransport} onClick={add}>
        + Add transport
      </button>
    </div>
  );
}
