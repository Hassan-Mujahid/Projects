import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Container,
  Paper,
  Grid2,
  Select,
  MenuItem,
  Alert,
  styled,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

// Custom Styled Components
const CustomPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.01)",
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: "50px",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.05)",
  },
}));

const SpeechRecognition = () => {
  const [interimText, setInterimText] = useState(""); // Real-time text while speaking
  const [finalisedText, setFinalisedText] = useState(""); // Finalized transcriptions
  const [translatedText, setTranslatedText] = useState(""); // Translated text
  const [listening, setListening] = useState(false); // Toggle listening state
  const [error, setError] = useState(""); // For error handling
  const [srcLanguage, setSrcLanguage] = useState("en-US"); // Default source language
  const [targetLanguage, setTargetLanguage] = useState("hi-IN"); // Default target language
  const [synthPlaying, setSynthPlaying] = useState(false); // For speech synthesis
  const [speechPlaying, setSpeechPlaying] = useState(false); // For speech State
  const [isOnlineMessageVisible, setIsOnlineMessageVisible] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [changeLanguage, setChangeLanguage] = useState(true);
  const lastTranscript = useRef("");

  // useEffect(() => {
  //   if (finalisedText) {
  //     translateText(finalisedText.toString());
  //   }
  // }, [targetLanguage]);

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    const checkNetworkSpeed = () => {
      if (connection) {
        const networkType = connection.effectiveType;

        // Check if the connection is slow
        if (
          networkType === "2g" ||
          networkType === "slow-2g" ||
          networkType === "3g" ||
          connection.downlink < 1
        ) {
          setError(
            "Slow internet detected. You may experience lag in speech recognition and synthesis."
          );
          setIsOnlineMessageVisible(false); // Hide "Back online" message if connection becomes slow again
        } else {
          // If the connection is back to normal, show "Back online" message
          setError(""); // Clear the error
          setIsOnlineMessageVisible(true);

          // Hide the "Back online" message after 3 seconds
          setTimeout(() => {
            setIsOnlineMessageVisible(false);
          }, 3000);
        }
      }
    };

    checkNetworkSpeed();

    connection && connection.addEventListener("change", checkNetworkSpeed);

    return () => {
      connection && connection.removeEventListener("change", checkNetworkSpeed);
    };
  }, []);

  const recognition = useRef(null);
  let isStopping = false;

  const speechSynthesisUtterance = useRef(null);

  // Initialize speech recognition
  const initRecognition = () => {
    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;

    // recognition.current.onresult = (event) => {
    //   if (!isStopping) {
    //     console.log("event.results:", event.results);
    //     const transcript = Array.from(event.results)
    //       .map((result) => result[0].transcript)
    //       .join("");
    //     console.log("transcript:", transcript);
    //     setInterimText(transcript);
    //   }
    // };

    recognition.current.onresult = (event) => {
      if (!isStopping) {
        let newInterim = "";
        let newFinal = finalisedText;
        for (const result of event.results) {
          const transcript = result[0].transcript;
          if (result.isFinal) {
            newFinal += transcript + " ";
          } else {
            newInterim = transcript;
          }
        }
        // Only update if the transcript is different
        if (newInterim !== lastTranscript.current) {
          setInterimText(newInterim);
          lastTranscript.current = newInterim;
        }
        if (newFinal !== finalisedText) {
          setFinalisedText(newFinal);
        }
      }
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(event.error);
    };

    recognition.current.onend = () => {
      if (listening && !isStopping) {
        recognition.current.start();
      } else {
        isStopping = false;
      }
    };
  };

  // Start listening
  const startListening = () => {
    if (changeLanguage) {
      setChangeLanguage(false);
    }
    if (!listening) {
      setListening(true);
      isStopping = false;
      if (!recognition.current) {
        initRecognition();
      }
      recognition.current && (recognition.current.lang = srcLanguage);
      recognition.current.start();
    }
  };

  // Stop listening and finalize text
  const stopListening = () => {
    if (listening && !isStopping) {
      isStopping = true;
      setListening(false);
      recognition.current.onend = null;
      recognition.current.stop();

      // Finalize the interim text and trigger translation
      // setFinalisedText(interimText);
      translateText(finalisedText); // Trigger translation
      setInterimText(""); // Clear interim text
    }
  };

  // Translate the finalized text using LibreTranslate API
  const translateText = async (text) => {
    try {
      if (text === "") {
        setTranslatedText("");
        setError("Cannot translate empty text. Try Again");
        return;
      }
      setTranslating(true);
      const response = await fetch(
        "https://voice-translation-api.vercel.app/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            srcLang: srcLanguage.split("-")[0],
            targetLanguage: targetLanguage.split("-")[0],
          }),
        }
      );

      const data = await response.json();
      if (data === "Translation failed") {
        setError(`${data}, try again`);
        setTranslating(false);
        return;
      }
      setError("");
      setTranslatedText(data.translatedText);
      setTranslating(false);
      // Trigger speech synthesis

      startSpeechSynthesis(data.translatedText);
    } catch (error) {
      console.error("Error during translation:", error);
      setError("Translation error");
      setTranslating(false);
    }
  };

  // Start speech synthesis to read out the translated text
  const startSpeechSynthesis = (text) => {
    setSpeechPlaying(true);
    if (window.speechSynthesis) {
      speechSynthesisUtterance.current = new SpeechSynthesisUtterance(text);
      speechSynthesisUtterance.current.lang = targetLanguage;
      window.speechSynthesis.speak(speechSynthesisUtterance.current);

      speechSynthesisUtterance.current.onstart = () => {
        // setSpeechPlaying(true);
      };
      speechSynthesisUtterance.current.onend = () => {
        setSpeechPlaying(false);
      };

      setSynthPlaying(true);
    } else {
    }
  };

  // Stop speech synthesis
  const stopSpeech = () => {
    if (synthPlaying && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSynthPlaying(false);
      setSpeechPlaying(false);
    }
  };

  // Replay the last translated text
  const playSpeech = () => {
    if (translatedText) {
      startSpeechSynthesis(translatedText);
    }
  };

  const changeLang = () => {
    interimText && setInterimText("");
    setTranslatedText("");
    setFinalisedText("");
    setChangeLanguage(true);
  };

  return (
    <Container maxWidth="lg">
      <CustomPaper>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Modern Speech Recognition & Translation
          </motion.div>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {isOnlineMessageVisible && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Online
          </Alert>
        )}

        {/* Language Dropdowns */}
        <Grid2
          container
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4, mb: 2 }}
        >
          {changeLanguage && (
            <Grid2 item="true" xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Translate from:
              </Typography>
              <Select
                value={srcLanguage}
                onChange={(e) => setSrcLanguage(e.target.value)}
                fullWidth
              >
                <MenuItem value="de-DE">German (Germany)</MenuItem>
                <MenuItem value="en-US">English (United States)</MenuItem>
                <MenuItem value="es-ES">Spanish (Spain)</MenuItem>
                <MenuItem value="fr-FR">French (France)</MenuItem>
                <MenuItem value="hi-IN">Hindi (India)</MenuItem>
                <MenuItem value="id-ID">Indonesian (Indonesia)</MenuItem>
                <MenuItem value="it-IT">Italian (Italy)</MenuItem>
                <MenuItem value="ja-JP">Japanese (Japan)</MenuItem>
                <MenuItem value="ko-KR">Korean (South Korea)</MenuItem>
                <MenuItem value="nl-NL">Dutch (Netherlands)</MenuItem>
                <MenuItem value="pl-PL">Polish (Poland)</MenuItem>
                <MenuItem value="pt-BR">Portuguese (Brazil)</MenuItem>
                <MenuItem value="ru-RU">Russian (Russia)</MenuItem>
              </Select>
            </Grid2>
          )}

          {changeLanguage && (
            <Grid2 item="true" xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Translate to:
              </Typography>
              <Select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                fullWidth
              >
                <MenuItem value="de-DE">German (Germany)</MenuItem>
                <MenuItem value="en-US">English (United States)</MenuItem>
                <MenuItem value="es-ES">Spanish (Spain)</MenuItem>
                <MenuItem value="fr-FR">French (France)</MenuItem>
                <MenuItem value="hi-IN">Hindi (India)</MenuItem>
                <MenuItem value="id-ID">Indonesian (Indonesia)</MenuItem>
                <MenuItem value="it-IT">Italian (Italy)</MenuItem>
                <MenuItem value="ja-JP">Japanese (Japan)</MenuItem>
                <MenuItem value="ko-KR">Korean (South Korea)</MenuItem>
                <MenuItem value="nl-NL">Dutch (Netherlands)</MenuItem>
                <MenuItem value="pl-PL">Polish (Poland)</MenuItem>
                <MenuItem value="pt-BR">Portuguese (Brazil)</MenuItem>
                <MenuItem value="ru-RU">Russian (Russia)</MenuItem>
              </Select>
            </Grid2>
          )}
          {!changeLanguage && (
            <Grid2 item="true" xs={12} sm={6} md={3}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CustomButton
                  variant="contained"
                  color="primary"
                  onClick={changeLang}
                  disabled={listening || speechPlaying || translating}
                  fullWidth
                >
                  Change Language
                </CustomButton>
              </motion.div>
            </Grid2>
          )}
        </Grid2>

        {/* Control Buttons with Animations */}
        <Grid2 container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
          <Grid2 item="true" xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CustomButton
                variant="contained"
                color="primary"
                onClick={startListening}
                disabled={listening || speechPlaying || translating}
                fullWidth
              >
                Start Listening
              </CustomButton>
            </motion.div>
          </Grid2>
          <Grid2 item="true" xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CustomButton
                variant="contained"
                color="secondary"
                onClick={stopListening}
                disabled={!listening}
                fullWidth
              >
                Stop Listening
              </CustomButton>
            </motion.div>
          </Grid2>
        </Grid2>

        {/* Play and Stop Speech Buttons - Aligned Left and Right */}
        <Grid2
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{
            mt: 4,
            px: {
              xs: 1,
              sm: 3,
              display: "flex",
            }, // Adjust padding for mobile and larger screens
          }}
        >
          {/* Play Speech Button on the Left */}
          <Grid2
            item="true"
            mr={3}
            xs={6}
            md={3}
            sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CustomButton
                variant="contained"
                color="primary"
                onClick={() => playSpeech(finalisedText)}
                disabled={
                  !finalisedText || speechPlaying || translating || listening
                }
                sx={{}}
              >
                Play Speech
              </CustomButton>
            </motion.div>
          </Grid2>

          {/* Stop Speech Button on the Right */}
          <Grid2
            item="true"
            xs={6}
            md={3}
            sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CustomButton
                variant="contained"
                color="secondary"
                onClick={stopSpeech}
                disabled={!speechPlaying}
                sx={
                  {
                    // width: { xs: "100%" }, // Adjust size for mobile
                  }
                }
              >
                Stop Speech
              </CustomButton>
            </motion.div>
          </Grid2>
        </Grid2>

        {/* Progress Indicator */}
        {listening && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Display text outputs */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Interim Text:</Typography>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
              {interimText}
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Finalized Transcription:</Typography>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
              {finalisedText}
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Translated Text:</Typography>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
              {translating ? <CircularProgress /> : translatedText}
            </Typography>
          </motion.div>
        </Box>
      </CustomPaper>
    </Container>
  );
};

export default SpeechRecognition;
