// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title 链上记事本
/// @notice 每个钱包地址维护自己的一组笔记，互不干扰
contract Notepad {

    // 一条笔记的结构
    struct Note {
        uint256 id;         // 在作者名下的序号，从 0 开始
        string  content;    // 正文
        uint256 createdAt;  // 创建时的区块时间戳（秒）
        bool    deleted;    // 软删除标记
    }

    // 地址 => 该地址的笔记数组。private 只是不自动生成 getter，
    // 链上数据本身永远是公开可读的，别用它存秘密。
    mapping(address => Note[]) private _notes;

    // 事件：写进交易日志，比存储便宜得多，前端可以监听
    event NoteCreated(
        address indexed author,
        uint256 indexed id,
        string content,
        uint256 createdAt
    );
    event NoteDeleted(address indexed author, uint256 indexed id);

    /// @notice 新增一条笔记（写操作，要付 gas）
    function addNote(string calldata content) external {
        require(bytes(content).length > 0, "content empty");
        require(bytes(content).length <= 280, "content too long");

        uint256 id = _notes[msg.sender].length;

        _notes[msg.sender].push(Note({
            id:        id,
            content:   content,
            createdAt: block.timestamp,
            deleted:   false
        }));

        emit NoteCreated(msg.sender, id, content, block.timestamp);
    }

    /// @notice 软删除自己的某条笔记
    function deleteNote(uint256 id) external {
        require(id < _notes[msg.sender].length, "note not found");

        Note storage n = _notes[msg.sender][id];
        require(!n.deleted, "already deleted");

        n.deleted = true;
        emit NoteDeleted(msg.sender, id);
    }

    /// @notice 读取某个地址的全部笔记（只读，不花 gas）
    function getNotes(address user) external view returns (Note[] memory) {
        return _notes[user];
    }

    /// @notice 某个地址有多少条笔记（含已删除）
    function noteCount(address user) external view returns (uint256) {
        return _notes[user].length;
    }
}
