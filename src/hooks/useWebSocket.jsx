// hooks/useStreamWebSocket.js
function useStreamWebSocket(streamId) {
  const { setViewers, setChatMessages, setReactions } = useStreamContext();

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/stream/${streamId}/`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "viewer_count_update":
          setViewers(data.viewer_count);
          break;
        case "chat_message":
          setChatMessages((prev) => [...prev, data]);
          break;
        case "reaction":
          setReactions((prev) => [...prev, data]);
          break;
      }
    };

    return () => ws.close();
  }, [streamId]);
}
