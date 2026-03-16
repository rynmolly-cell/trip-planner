import { useTripContext } from "../context/TripContext";
import { createActionItem } from "../utils/tripFactory";
import type { ActionItem as ActionItemType } from "../types/trip";
import styles from "./ActionItems.module.css";

export default function ActionItems({
  readOnly: readOnlyProp,
}: { readOnly?: boolean } = {}) {
  const { activeTrip, updateTrip, readOnly: ctxReadOnly } = useTripContext();
  const readOnly = readOnlyProp ?? ctxReadOnly ?? false;

  if (!activeTrip) return null;

  const items = activeTrip.actionItems;

  const updateItems = (newItems: ActionItemType[]) => {
    updateTrip(activeTrip.id, { actionItems: newItems });
  };

  const addItem = () => {
    updateItems([...items, createActionItem()]);
  };

  const updateItem = (id: string, updates: Partial<ActionItemType>) => {
    updateItems(
      items.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const removeItem = (id: string) => {
    updateItems(items.filter((i) => i.id !== id));
  };

  const toggleDone = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) updateItem(id, { done: !item.done });
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Action Items</h2>
      <p className={styles.subtitle}>
        Tasks to complete before or during your trip
      </p>

      <ul className={styles.list}>
        {items.map((item) => (
          <li
            key={item.id}
            className={`${styles.item} ${item.done ? styles.done : ""}`}
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => !readOnly && toggleDone(item.id)}
              aria-label={`Mark "${item.text}" as done`}
              disabled={readOnly}
            />
            <div className={styles.itemContent}>
              <input
                type="text"
                value={item.text}
                onChange={(e) =>
                  !readOnly && updateItem(item.id, { text: e.target.value })
                }
                placeholder="Add task..."
                className={styles.textInput}
                readOnly={readOnly}
              />
              <input
                type="date"
                value={item.dueDate ?? ""}
                onChange={(e) =>
                  !readOnly &&
                  updateItem(item.id, {
                    dueDate: e.target.value || undefined,
                  })
                }
                className={styles.dueInput}
                readOnly={readOnly}
              />
            </div>
            {!readOnly && (
              <button
                type="button"
                className={styles.remove}
                onClick={() => removeItem(item.id)}
                title="Remove"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>

      {!readOnly && (
        <button type="button" className={styles.add} onClick={addItem}>
          + Add item
        </button>
      )}
    </div>
  );
}
