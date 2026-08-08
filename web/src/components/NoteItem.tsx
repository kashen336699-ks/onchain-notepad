import { useEffect, useState } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { NOTEPAD_ABI, NOTEPAD_ADDRESS } from '../contracts/notepad';
import type { Note } from './types';

type Props = { note: Note; onDeleted: () => void };

export default function NoteItem({ note, onDeleted }: Props) {
  const [confirming, setConfirming] = useState(false);

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // 删除确认上链后，通知父组件重新读链（这里没有 setState，规则不触发）
  useEffect(() => {
    if (isSuccess) onDeleted();
  }, [isSuccess, onDeleted]);

  const busy = isPending || isConfirming;

  function handleDelete() {
    setConfirming(false);
    writeContract({
      address: NOTEPAD_ADDRESS,
      abi: NOTEPAD_ABI,
      functionName: 'deleteNote',
      args: [note.id], // 注意：id 是 BigInt，直接传，别 Number()
    });
  }

  return (
    <li className={busy ? 'note is-busy' : 'note'}>
      <div className="note-head">
        <span className="note-id">ID · {note.id.toString()}</span>

        {busy ? (
          <span className="note-busy">
            <span className="spin" />
            {isPending ? '请在钱包中确认…' : '删除上链中…'}
          </span>
        ) : confirming ? (
          <span className="confirm">
            <span>确定删除？</span>
            <button type="button" className="mini danger" onClick={handleDelete}>
              删除
            </button>
            <button
              type="button"
              className="mini"
              onClick={() => setConfirming(false)}
            >
              取消
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="icon-btn"
            title="删除这条笔记"
            aria-label="删除这条笔记"
            onClick={() => setConfirming(true)}
          >
            ✕
          </button>
        )}
      </div>

      <div className="note-body">{note.content}</div>

      <div className="note-meta">
        <time>
          {new Date(Number(note.createdAt) * 1000).toLocaleString('zh-CN')}
        </time>
        <span className="chip">◆ 已上链</span>
      </div>

      {error && (
        <p className="tx err">
          删除失败：
          {(error as { shortMessage?: string }).shortMessage ?? error.message}
        </p>
      )}
    </li>
  );
}
