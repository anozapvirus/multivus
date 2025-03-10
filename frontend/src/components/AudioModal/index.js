import { Button, CircularProgress } from "@material-ui/core";
import React, { useRef, useEffect, useState } from "react";
const LS_NAME = 'audioMessageRate';
const AudioModal = ({ url }) => {
    const audioRef = useRef(null);
    const [audioRate, setAudioRate] = useState(parseFloat(localStorage.getItem(LS_NAME) || "1"));
    const [showButtonRate, setShowButtonRate] = useState(false);
    const [transcription, setTranscription] = useState(""); // Novo estado para transcrição
    const [isTranscribing, setIsTranscribing] = useState(false); // Estado de carregamento
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    useEffect(() => {
        audioRef.current.playbackRate = audioRate;
        localStorage.setItem(LS_NAME, audioRate);
    }, [audioRate]);
    useEffect(() => {
        audioRef.current.onplaying = () => {
            setShowButtonRate(true);
        };
        audioRef.current.onpause = () => {
            setShowButtonRate(false);
        };
        audioRef.current.onended = () => {
            setShowButtonRate(false);
        };
    }, []);
    const toggleRate = () => {
      let newRate = null;
  
      switch (audioRate) {
          case 1:
              newRate = 1.5;
              break;
          case 1.5:
              newRate = 2;
              break;
          case 2:
              newRate = 1;
              break;
          default:
              newRate = 1;
              break;
      }
  
      setAudioRate(newRate);
  };
    const getAudioSource = () => {
        let sourceUrl = url;
        if (isIOS) {
            sourceUrl = sourceUrl.replace(".ogg", ".mp3");
        }
        return (
            <source src={sourceUrl} type={isIOS ? "audio/mp3" : "audio/ogg"} />
        );
    };
    const transcreverAudio = async () => {
        setIsTranscribing(true); // Inicia o carregamento
        try {
            const formData = new FormData();
            const response = await fetch(url);
            const audioBlob = await response.blob();
            formData.append('audio', audioBlob, 'audio.ogg');
            const transcribeResponse = await fetch("https://transcritor.multivus.com.br", {
                method: "POST",
                body: formData,
            });
            const result = await transcribeResponse.text();
            setTranscription(result); // Atualiza a transcrição no estado
        } catch (error) {
            console.error("Erro ao transcrever o áudio:", error);
        } finally {
            setIsTranscribing(false); // Finaliza o carregamento
        }
    };
    return (
        <>
            <audio ref={audioRef} controls>
                {getAudioSource()}
            </audio>
            {showButtonRate && (
                <Button
                    style={{ marginLeft: "5px", marginTop: "-45px" }}
                    onClick={toggleRate}
                >
                    {audioRate}x
                </Button>
            )}
            {/* Botão de transcrição */}
            <Button onClick={transcreverAudio}>Transcrever</Button>
            {/* Exibe ícone de carregamento e texto de feedback */}
            {isTranscribing && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={30} style={{ marginRight: '10px' }} />
                    Transcrição em andamento...
                </div>
            )}
            {/* Exibe a transcrição após conclusão */}
            {transcription && <div>{transcription}</div>}
        </>
    );
};
export default AudioModal;