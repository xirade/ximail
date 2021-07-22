const { onBeforeUnmount } = require("@vue/runtime-core");

const useKeydown = keyCombos => {
  const onKeydown = e => {
    let kc = keyCombos.find(kc => kc.key == e.key);
    if (kc) {
      kc.fn();
    }
  };
  window.addEventListener("keydown", onKeydown);

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeydown);
  });
};

export default useKeydown;
