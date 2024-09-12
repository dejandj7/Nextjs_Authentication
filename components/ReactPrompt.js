import React, { useEffect, useState, useRef } from "react";
import { Modal } from "antd";
import { useRouter } from "next/router";

const ReactPrompt = (props) => {
  const router = useRouter();
  const { when, title, content } = props;
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    const routeChangeStart = () => {
      const ok = callback();
      if (!ok) {
        handleShowModal();
      }
    };
    const handleRouteChange = (url, { shallow }) => {
      handleShowModal();
    };

    router.events.on("routeChangeStart", routeChangeStart);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
    };
  }, [router]);

  function handleShowModal() {
    setShowPrompt(true);
  }

  function onCancel() {
    setShowPrompt(false);
  }

  function handleConfirm() {
    if (unblockRef) {
      unblockRef.current();
    }
    setShowPrompt(false);
    history.push(currentPath);
  }

  return (
    <Modal
      centered
      title={title}
      open={showPrompt}
      onOk={handleConfirm}
      onCancel={onCancel}
    >
      {content}
    </Modal>
  );
};

export default ReactPrompt;
