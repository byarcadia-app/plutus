/** A promise the test settles by hand, to observe the state while a call is in flight. */
export function deferred<Value>() {
  let resolve: (value: Value) => void = () => {};
  let reject: (reason: unknown) => void = () => {};
  const promise = new Promise<Value>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });

  return { promise, resolve, reject };
}
