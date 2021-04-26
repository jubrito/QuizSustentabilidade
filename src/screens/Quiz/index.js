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
import movingSeaData from './animations/wave.json';
import parse from "html-react-parser";
import LinkButton from '../../components/LinkButton';
import Subtitle from '../../components/Subtitle';
import Footer from '../../components/Footer';

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
function SeaWidget() {
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
    movingSeaData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Lottie
      options={defaultOptions}
      height="400px"
      width="400px"
    />
  );
}
function ResultWidget({ results, totalQuestions, externalTextResults }) {
  const points = results.filter((x) => x).length;
  const [textResult, setTextResult] = useState("");
  
  useEffect(()=> {
    if (points < 4) {
     setTextResult(externalTextResults.bad);
    } else if (points >= 5 ||points < 10) {
      setTextResult(externalTextResults.regular);
    } else {
      setTextResult(externalTextResults.good);
    }
  }, [externalTextResults]);
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
        Resultado
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
          {points+"/"+totalQuestions}
          {' '}
          perguntas
        </p>
        <p>{parse(textResult)}</p>
        {/* <ul>
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
        </ul> */}
        <LinkButton href="/" text="Refazer o teste"/>
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
  var [hasAlreadyConfirmedDelay, setHasAlreadyConfirmedDelay] = useState(false);

  // delay de alguns segundos para o botão de próxima pergunta ser ativado
  useEffect(()=> {
    if (hasAlreadyConfirmed) {
      setTimeout(()=> {
          setHasAlreadyConfirmedDelay(true);
        }, 2000)
    } else {
      setHasAlreadyConfirmedDelay(false);
    }
  }, [hasAlreadyConfirmed])
    
  return (
    <Widget
      as={motion.section}
      // delay quanto tempo espera pra começar e duração em s
      transition={{ delay: 0, duration: 0.5 }}
      variants={{
        // o elemento terá estados de animação
        show: { opacity: 1, y: '0', IDBIndex: 30 },
        hidden: { opacity: 0, y: '-100%', IDBIndex: -1 },
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
        <h1>
          {question.title}
        </h1>
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
            {/* <div className="mt-15">
              <Button type="button" onClick={() => handleExplanation()} disabled={!hasAlternativeSelected || hasAlreadyConfirmed}>
                Confirmar
              </Button>
              <Button type="submit" onSubmit={() => handleQuizPageSubmit()} disabled={!hasAlreadyConfirmed}>
                Próxima Pergunta
              </Button>
            </div> */}
          {
            hasAlreadyConfirmed ? 
            <Button type="submit" onSubmit={() => handleQuizPageSubmit()} disabled={!hasAlreadyConfirmedDelay}>
              Próximo
            </Button>
            : 
            <Button type="button" onClick={() => handleExplanation()} disabled={!hasAlternativeSelected || hasAlreadyConfirmed}>
              Confirmar
            </Button>
          }
          {/* <p>{`${selectedAlternative}`}</p> */}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}
function QuestionExplanation({
  explanations,
  source,
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
          show: { opacity: 1, x: '50%', y:'-50%', z:'0' },
          hidden: { opacity: 0, x: '40%', y:'-50%', z:'100%' },
        }}
        initial="hidden"
        animate={animate}>
        <div>
          <Subtitle><strong>Resposta correta:</strong> {answer}</Subtitle>
          {explanations.map((explanation) => {
           return <p>{parse(explanation)}</p>
          })}
          <p className="source">Fonte: 
          {source.map((src) => {
           return <a href={src.url} target="_blank">{src.title}</a>
          })}
          </p>
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
  externalQuestions, externalBg, externalBgMobile, externalTextResults, projectName, gitHubUser,
}) {
  // console.log(db.questions)
  const [screenState, setScreenState] = useState(screenStates.LOADING); // estado inicial
  const totalQuestions = externalQuestions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const explanations = question.explanation;
  const source = question.source;
  const answer = question.alternatives[question.answer];
  const [results, setResults] = useState([]);
  const bg = externalBg;
  const bg_mobile = externalBgMobile !== undefined ? externalBgMobile : externalBg;
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
    <QuizBackground backgroundImage={bg} backgroundImageResponsive={bg_mobile}>
      <QuizContainer>
        <QuizLogo />
        {/* Se for loading renderiza o LoadingWidget */}
        {screenState == screenStates.LOADING && <LoadingWidget />}
        {screenState == screenStates.QUIZ && (
          <>
          <div className="relative">
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
              source={source}
              animate={action}
              answer={answer}>
            </QuestionExplanation>
          </div>
          </>
        )}
        {screenState == screenStates.RESULT && <ResultWidget results={results} totalQuestions={totalQuestions} externalTextResults={externalTextResults}/>}
      </QuizContainer>
      {/* <GitHubCorner projectUrl={`https://github.com/${gitHubUser}/${projectName}`} /> */}
      <GitHubCorner projectUrl="https://github.com/jubrito/uxuiquiz"/>
      {/* <Footer><SeaWidget/><p>Adaptação do desafio proposto pela Alura na Imersão React feita por Juliana Witzke de Brito</p></Footer> */}
      <Footer><p>Adaptação do desafio proposto pela Alura na Imersão React feita por Juliana Witzke de Brito</p></Footer>
    </QuizBackground>
  );
}
