import NoteItem from './NoteItem';
import type { Notes } from './types';

type Props = {
  notes: Notes | undefined;
  isLoading: boolean;
  error?: Error | null;
  onChanged: () => void;
};

export default function NoteList({
  notes,
  isLoading,
  error,
  onChanged,
}: Props) {
  if (isLoading) {
    return (
      <p className="state caret">
        <span className="spin" />
        正在从链上读取
      </p>
    );
  }

  if (error) return <p className="state bad">读取失败：{error.message}</p>;

  // 过滤掉软删除的
  const visible = (notes ?? []).filter((n) => !n.deleted);

  if (visible.length === 0) {
    return <p className="state caret">还没有笔记，写下第一条吧</p>;
  }

  return (
    <ul className="notes">
      {/* 新的排前面。BigInt 不能直接当 key，要 toString() */}
      {[...visible].reverse().map((note) => (
        <NoteItem key={note.id.toString()} note={note} onDeleted={onChanged} />
      ))}
    </ul>
  );
}
