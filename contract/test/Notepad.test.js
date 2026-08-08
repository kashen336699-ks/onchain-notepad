const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Notepad", function () {
  let notepad, owner, other;

  // 每个 it 之前都重新部署一份干净的合约
  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    const Notepad = await ethers.getContractFactory("Notepad");
    notepad = await Notepad.deploy();
    await notepad.waitForDeployment();
  });

  it("能新增一条笔记", async function () {
    await notepad.addNote("我的第一条链上笔记");
    const notes = await notepad.getNotes(owner.address);

    expect(notes.length).to.equal(1);
    expect(notes[0].content).to.equal("我的第一条链上笔记");
    expect(notes[0].deleted).to.equal(false);
  });

  it("内容为空时应该回滚", async function () {
    await expect(notepad.addNote(""))
      .to.be.revertedWith("content empty");
  });

  it("不同账户的笔记互相隔离", async function () {
    await notepad.addNote("owner 的笔记");
    await notepad.connect(other).addNote("other 的笔记");

    expect((await notepad.getNotes(owner.address)).length).to.equal(1);
    expect((await notepad.getNotes(other.address)).length).to.equal(1);
  });

  it("能软删除自己的笔记", async function () {
    await notepad.addNote("待删除");
    await notepad.deleteNote(0);

    const notes = await notepad.getNotes(owner.address);
    expect(notes[0].deleted).to.equal(true);
  });

  it("新增笔记会抛出 NoteCreated 事件", async function () {
    await expect(notepad.addNote("hello"))
      .to.emit(notepad, "NoteCreated");
  });
});
