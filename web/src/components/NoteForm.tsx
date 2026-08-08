import { useEffect, useState, type FormEvent } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { NOTEPAD_ABI, NOTEPAD_ADDRESS } from '../contracts/notepad';

/** 合约里的硬限制：require(bytes(content).length <= 280) */
const MAX_BYTES = 280;

type Props = { onSaved: () => void; disabled?: boolean };

export default function NoteForm({ onSaved, disabled }: Props) {
  const [text, setText] = useState('');

  // 前半段：发交易
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  // 后半段：等上链确认
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // 确认成功后：清空输入框 + 通知父组件重新读链。
  // 这里的 setState 是在响应"交易被链上确认"这个外部事件（不是从 props 派生状态），
  // 用 effect 是合理的，React 19 的 set-state-in-effect 规则在此场景属于误报。
  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText('');
      onSaved();
    }
  }, [isSuccess, onSaved]);

  // 合约数的是字节不是字符：一个汉字 3 字节，所以前端也必须按字节算
  const bytes = new TextEncoder().encode(text).length;
  const overflow = bytes > MAX_BYTES;
  const busy = isPending || isConfirming;
  const blocked = busy || disabled || overflow || !text.trim();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (blocked) return;
    writeContract({
      address: NOTEPAD_ADDRESS,
      abi: NOTEPAD_ABI,
      functionName: 'addNote',
      args: [text],
    });
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="panel-title">NEW ENTRY · 写入链上</div>

      <textarea
        className="editor"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="写点什么，它会永远留在链上…"
        disabled={busy || disabled}
      />

      <div className="editor-foot">
        <span className={overflow ? 'meter over' : 'meter'}>
          <b>{bytes}</b> / {MAX_BYTES} 字节
          {overflow && ' · 超出合约限制'}
        </span>
        <button className="btn" type="submit" disabled={blocked}>
          {isPending
            ? '请在钱包中确认…'
            : isConfirming
              ? '上链中，约 15 秒…'
              : '⚡ 写入区块链'}
        </button>
      </div>

      {hash && !isSuccess && (
        <p className="tx">
          {isConfirming && <span className="spin" />}
          交易已广播：
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener"
          >
            {hash.slice(0, 10)}…{hash.slice(-8)}
          </a>
        </p>
      )}

      {/* text === '' 是关键：用户一开始重新打字，上一笔的成功提示就自动消失 */}
      {isSuccess && hash && text === '' && (
        <p className="tx ok">
          ✅ 已经写进区块链了 ·{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener"
          >
            查看交易
          </a>
        </p>
      )}

      {error && (
        <p className="tx err">
          交易失败：
          {(error as { shortMessage?: string }).shortMessage ?? error.message}
        </p>
      )}
    </form>
  );
}
