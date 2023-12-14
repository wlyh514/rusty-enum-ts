import { Enum, EnumPromise, EnumType, asyncMatch, ifLet, intoOptionPromise, intoResultPromise } from "../src";

interface Message {
  Quit: null,
  Move: { x: number, y: number },
  Write: string,
  ChangeColor: [number, number, number]
};
const Message = Enum<Message>();

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

async function msgPromise(): EnumPromise<Message> {
  return Message.Move({ x: 42, y: 64 });
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
    const moveX = ifLet(moveMsg, "Move", ({ x }) => x);
    expect(moveX).toEqual(42);
    let cbCalled = false;
    const moveY = ifLet(quitMsg, "Move", ({ y }) => {
      cbCalled = true;
      return y;
    });
    expect(moveY).toBeNull();
    expect(cbCalled).toEqual(false);
  });

  test("async match", async () => {
    const moveMsgPromise = msgPromise();
    const x = await asyncMatch(moveMsgPromise, {
      Move({ x }) {
        return x;
      },
      _: () => 0
    });

    expect(x).toEqual(42);
  });

  describe("async result", () => {
    test("resolve", async () => {
      const resolvePromise: Promise<number> = new Promise((res, _) => res(42));
      const resolveResult = await intoResultPromise(resolvePromise);
      expect(resolveResult._data).toEqual(42);
      expect(resolveResult._variant).toEqual("Ok");
    });

    test("reject without mapping error", async () => {
      const rejectPromise: Promise<number> = new Promise((_, rej) => rej(42));
      const rejectResult = await intoResultPromise(rejectPromise);
      expect(rejectResult._data).toEqual(42);
      expect(rejectResult._variant).toEqual("Err");
    });

    test("reject with error mapped", async () => {
      const rejectPromise: Promise<number> = new Promise((_, rej) => rej(42));
      const rejectResult = await intoResultPromise<number, string>(rejectPromise, (err) => err.toString());
      expect(rejectResult._data).toEqual("42");
      expect(rejectResult._variant).toEqual("Err");
    })
  });

  describe("async option", () => {
    test("reject", async () => {
      const resolvePromise: Promise<number> = new Promise((_, rej) => rej(42));
      const resolveOption = await intoOptionPromise(resolvePromise);
      expect(resolveOption._data).toBeUndefined();
      expect(resolveOption._variant).toEqual("None");
    });

    test("resolve", async () => {
      const rejectPromise: Promise<number> = new Promise((res, _) => res(42));
      const rejectOption = await intoOptionPromise(rejectPromise);
      expect(rejectOption._data).toEqual(42);
      expect(rejectOption._variant).toEqual("Some");
    });
  });
});
