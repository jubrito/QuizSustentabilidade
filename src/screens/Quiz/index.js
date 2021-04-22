import React, { useState, useEffect } from 'react';
// import db from '../../../db.json';
// Render das telas (da rota Quiz)
import Lottie from 'react-lottie';
import { motion } from 'framer-motion';
import Widget from '../../components/Widget';
import AlternativesForm from '../../components/AlternativesForm';
import QuizBackground from '../../components/QuizBackground';
import QuizLogo from '../../components/QuizLogo';
import QuizContainer from '../../components/QuizContainer';
import QuizExplanations from '../../components/QuizExplanations';
import GitHubCorner from '../../components/GitHubCorner';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BackLinkArrow from '../../components/BackLinkArrow';
import animationData from './animations/loading.json';

function LoadingWidget() {
  const [animationState, setAnimationState] = useState({
    isStopped: false,
    isPaused: false,
  });

  // Se tiver um botão por exemplo pra fazer a animação ocorrer teria que ser assim
  // useEffect(() => {
  //   setAnimationState({
  //     ...animationState,
  //     isStopped: !animationState.isStopped, // o contrário do que tiver
  //   })
  // }, []);

  const defaultOptions = {
    loop: true, // false não roda em loop infinito
    autoplay: true, // false não carrega a animação quando recarrega
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>
      <Widget.Content>
        <Lottie
          options={defaultOptions}
          height="190px"
          width="100%"
        />
      </Widget.Content>

    </Widget>
  );
}
function ResultWidget({ results }) {
  return (
    <Widget
      as={motion.section}
      // delay quanto tempo espera pra começar e duração em s
      transition={{ delay: 0, duration: 0.5 }}
      variants={{
        // o elemento terá estados de animação
        show: { opacity: 1, y: '0' },
        hidden: { opacity: 0, y: '-100%' },
      }}
      initial="hidden"
      animate="show"
    >
      <Widget.Header>
        Tela de Resultado:
      </Widget.Header>

      <Widget.Content>
        <p>
          Você acertou
          {' '}
          {/* {results.reduce((somatoriaAtual, resultAtual) => {
            const isAcerto = resultAtual === true;
            if (isAcerto) {
              return somatoriaAtual + 1;
            }
            return somatoriaAtual;
          }, 0)} */}
          {results.filter((x) => x).length}
          {' '}
          perguntas
        </p>
        <ul>
          {results.map((result, index) => (
            <li key={`result__${index}`}>
              #
              {index + 1}
              {' '}
              Resultado:
              {result === true
                ? 'Acertou'
                : 'Errou'}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
  handleExplanation,
  hasAlreadyConfirmed
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false); // do formulário
  // se o usuário selecionou uma alternativa, coloca como true pra poder habilitar o botão
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;
  const questionId = `question__${questionIndex}`;

  return (
    <Widget
      as={motion.section}
      // delay quanto tempo espera pra começar e duração em s
      transition={{ delay: 0, duration: 0.5 }}
      variants={{
        // o elemento terá estados de animação
        show: { opacity: 1, y: '0' },
        hidden: { opacity: 0, y: '-100%' },
      }}
      initial="hidden"
      animate="show"
    >
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {/* Não usa o $ antes do {} pois é sintaxe do React, se fosse sintaxe do js seria ${} */}
          {`Pergunta ${questionIndex + 1} de ${totalQuestions} `}
        </h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativesForm
          onSubmit={(event) => {
            event.preventDefault(); // não atualiza a página
            setIsQuestionSubmited(true); // respondeu a pergunta
            if(hasAlreadyConfirmed){
              setTimeout(() => {
                addResult(isCorrect);
                onSubmit(); // dispara o onsubmit do form (o método handleQuizPageSubmit)
                setIsQuestionSubmited(false);
                setSelectedAlternative(undefined);
              }, 3 * 1000);
            }
          }}
        >
          {/* semelhante as alternativas */}
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={hasAlreadyConfirmed && alternativeStatus}
              >
                <Input
                  // style={{ display: 'none '}}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => {
                    setSelectedAlternative(alternativeIndex);
                  }}
                  type="radio"
                  // se já clicou em confirmar (hasAlreadyConfirmed=true), o botão deve ser desabilitado
                  disabled={hasAlreadyConfirmed}
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          {/* Console.log() no react na tela
            <pre>
              {JSON.stringify(question, null, 4)}
            </pre> */}

            <Button type="button" onClick={() => handleExplanation()} disabled={!hasAlternativeSelected || hasAlreadyConfirmed}>
              Confirmar
            </Button>
            <Button type="submit" onSubmit={() => handleQuizPageSubmit()} disabled={!hasAlreadyConfirmed}>
              Próxima Pergunta
            </Button>
          {/* {
            hasAlreadyConfirmed ? 
            <Button type="submit" onSubmit={() => handleQuizPageSubmit()} disabled={!hasAlternativeSelected && !hasAlreadyConfirmed}>
              Próxima Pergunta
            </Button>
            : 
            <Button type="button" onClick={() => handleExplanation()}>
              Confirmar
            </Button>
          } */}
          {/* <p>{`${selectedAlternative}`}</p> */}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}
function QuestionExplanation({
  explanations,
  answer,
  animate
}) {

  return (
    <>
        <QuizExplanations
        as={motion.section}
        // delay quanto tempo espera pra começar e duração em s
        transition={{ delay: 0, duration: 0.5 }}
        variants={{
          // o elemento terá estados de animação
          show: { opacity: 1, y: '-600px' },
          hidden: { opacity: 0, y: '-100%' },
        }}
        initial="hidden"
        animate={animate}>
        <div>
          <p><strong>Resposta correta:</strong> {answer}</p>
          {explanations.map((explanation) => {
           return <p>{explanation}</p>
          })}
        </div>
        </QuizExplanations>
        </>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage({
  externalQuestions, externalBg, projectName, gitHubUser,
}) {
  // console.log(db.questions)
  const [screenState, setScreenState] = useState(screenStates.LOADING); // estado inicial
  const totalQuestions = externalQuestions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const explanations = question.explanation;
  const answer = question.alternatives[question.answer];
  const [results, setResults] = useState([]);
  const bg = externalBg;
  const [action, setAction] = useState("hide");
  const [hasAlreadyConfirmed, setHasAlreadyConfirmed] = useState(false);

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  // nasce === didMount (componente é montado)
  // callbackfunction
  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 3 * 1000);
  }, []);

  // Muda o estado de ação para "show", exibindo as explicações da pergunta
  useEffect(() => {
    if (hasAlreadyConfirmed){
      setAction("show");
    }
  }, [hasAlreadyConfirmed]);

  function handleQuizSubmit() {
    setAction("hide");
    setHasAlreadyConfirmed(false);
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }
  // chamada quando o usuário clica no botão "confirmar"
  function handleExplanation() {
    setHasAlreadyConfirmed(true);
  }

  return (
    // Ao invés de fazer assim abaixo, criamos o componente com o style do background
    // <div style={{ backgroundImage: `url (${db.bg})` }}>
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {/* Se for loading renderiza o LoadingWidget */}
        {screenState == screenStates.LOADING && <LoadingWidget />}
        {screenState == screenStates.QUIZ && (
          <>
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleQuizSubmit}
            handleExplanation={handleExplanation}
            addResult={addResult}
            hasAlreadyConfirmed={hasAlreadyConfirmed}
          />
          <QuestionExplanation
            explanations={explanations}
            animate={action}
            answer={answer}>
          </QuestionExplanation>
          </>
        )}
        {screenState == screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
      <GitHubCorner projectUrl={`https://github.com/${gitHubUser}/${projectName}`} />
    </QuizBackground>
  );
}
