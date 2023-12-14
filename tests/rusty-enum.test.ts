import { EnumType, enumFactory, ifLet, match } from "../src";

interface Message {
  Quit: null,
  Move: { x: number, y: number },
  Write: string,
  ChangeColor: [number, number, number]
};
const Message = enumFactory<Message>();

function handleMsg(msg: EnumType<Message>) {
  return msg.match({
    Move: ({ x, y }) => `moved to (${x}, ${y})`,
    Write: (s) => `wrote '${s}'`,
    ChangeColor: (r, g, b) => `color changed to rgb(${r}, ${g}, ${b})`,
    Quit: () => "someone quit",
  });
}

function handleMsgWithDefault(msg: EnumType<Message>) {
  return msg.match({
    Write: () => "a message is written",
    _: () => "nothing is written",
  });
}

describe("Rusty enum", () => {
  let quitMsg: EnumType<Message>;
  let moveMsg: EnumType<Message>;
  let writeMsg: EnumType<Message>;
  let changeColorMsg: EnumType<Message>;

  beforeAll(() => {
    quitMsg = Message.Quit();
    expect(quitMsg._variant).toBe("Quit");

    moveMsg = Message.Move({ x: 42, y: 64 });
    expect(moveMsg._variant).toBe("Move");

    expect((moveMsg._data as any).x).toBe(42);
    expect((moveMsg._data as any).y).toBe(64);

    writeMsg = Message.Write("some text");
    expect(writeMsg._variant).toBe("Write");
    expect(writeMsg._data).toBe("some text");

    changeColorMsg = Message.ChangeColor(102, 204, 255);
    expect(changeColorMsg._variant).toBe("ChangeColor");
    expect(changeColorMsg._data).toEqual([102, 204, 255]);
  });

  test("Match method exact match", () => {
    expect(handleMsg(quitMsg)).toBe("someone quit");
    expect(handleMsg(moveMsg)).toBe("moved to (42, 64)");
    expect(handleMsg(writeMsg)).toBe("wrote 'some text'");
    expect(handleMsg(changeColorMsg)).toBe("color changed to rgb(102, 204, 255)");
  });

  test("Match method with default", () => {
    expect(handleMsgWithDefault(quitMsg)).toEqual("nothing is written");
    expect(handleMsgWithDefault(moveMsg)).toEqual("nothing is written");
    expect(handleMsgWithDefault(changeColorMsg)).toEqual("nothing is written");
    expect(handleMsgWithDefault(writeMsg)).toEqual("a message is written");
  });

  test("isVariant method", () => {
    expect(quitMsg.isQuit()).toBe(true);
    expect(quitMsg.isMove()).toBe(false);
    expect(quitMsg.isWrite()).toBe(false);
    expect(quitMsg.isChangeColor()).toBe(false);
  });

  test("ifLet function", () => {
    const moveX = ifLet(moveMsg, "Move", ({x}) => x);
    expect(moveX).toEqual(42);
    let cbCalled = false; 
    const moveY = ifLet(quitMsg, "Move", ({y}) => {
      cbCalled = true; 
      return y;
    });
    expect(moveY).toBeNull();
    expect(cbCalled).toEqual(false);
  });
});
