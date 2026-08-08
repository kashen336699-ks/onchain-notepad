import type { ReadContractReturnType } from 'viem';
import type { NOTEPAD_ABI } from '../contracts/notepad';

// 直接从 ABI 推出返回类型，以后合约改了这里自动跟着变
export type Notes = ReadContractReturnType<typeof NOTEPAD_ABI, 'getNotes'>;
export type Note = Notes[number];
