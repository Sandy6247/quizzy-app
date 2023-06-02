import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { decode } from "html-entities";
import { useNavigation, useRoute } from '@react-navigation/native';

const QuizScreen = () => {
    const navigation = useNavigation();

    const route = useRoute();
    const { questionIndex } = route.params;

    const [quizOver, setQuizOver] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [amount, setAmount] = useState(10);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showCorrection, setShowCorrection] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    function decodeHtml(html) {
        return decode(html);
    }

    useEffect(() => {
        if (!quizOver) {
            setCurrentQuestionIndex(questionIndex);
            fetchQuestions();
        }
    }, [quizOver]);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(
                'https://opentdb.com/api.php?amount=10&type=multiple'
            );
            const fetchedQuestions = response.data.results.slice(0, amount);
            setQuestions(fetchedQuestions);

            const allAnswers = fetchedQuestions.map((question) => {
                const allAnswers = [...question.incorrect_answers, question.correct_answer];
                const mixedAnswers = shuffle(allAnswers);

                return mixedAnswers.map((answer, index) => ({
                    id: index,
                    text: answer,
                }));
            });
            setAnswers(allAnswers);
        } catch (error) {
            console.error(error);
        }
    };

    const shuffle = (array) => {
        const mixedArray = [...array];

        for (let i = mixedArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mixedArray[i], mixedArray[j]] = [mixedArray[j], mixedArray[i]];
        }
        return mixedArray;
    };

    const getLetter = (index) => {
        const letters = ['A', 'B', 'C', 'D'];
        return letters[index];
    };

    const restartQuiz = () => {
        setQuizOver(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsAnswered(false);
        setShowCorrection(false)
    };

    const toNextQuestion = (index) => {
        if (isLoading) {
            return; // Ne pas exécuter la logique de réponse si le chargement est en cours
        }

        const selectedAnswerText = answers[currentQuestionIndex][index].text;
        setSelectedAnswer(selectedAnswerText);

        const isCorrect = selectedAnswerText === questions[currentQuestionIndex]?.correct_answer;
        setIsCorrect(isCorrect);

        if (isCorrect) {
            setScore(score + 1);
        }

        setIsAnswered(true);
        setShowCorrection(true);

        if (currentQuestionIndex === questions.length - 1) {
            setTimeout(() => {
                setQuizOver(true);
            }, 2000);
        } else {
            setIsLoading(true); // Activer le chargement
            setTimeout(() => {
                setSelectedAnswer(null);
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setIsAnswered(false);
                setShowCorrection(false);
                setIsLoading(false); // Désactiver le chargement après 2 secondes
            }, 2000);
        }
        console.log(score);
    };

    return (
        <View>
            {quizOver ? (
                <View style={styles.quizOverContainer}>
                    <Image
                        style={{ width: '100%', height: 350, resizeMode: 'contain', marginTop: 0, marginBottom: 20 }}
                        source={require('../assets/logo.jpg')} />
                    <Text style={styles.quizOverText}>Quiz Over</Text>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>Your Score:</Text>
                        <Text style={styles.scoreValue}>{score}/{amount}</Text>
                    </View>
                    <Pressable style={styles.restartButton} onPress={restartQuiz}>
                        <Text style={styles.restartButtonText}>Restart the quiz</Text>
                    </Pressable>
                </View>
            ) : (
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 15, paddingHorizontal: 15 }}>
                        <Text style={{ fontSize: 18, fontWeight: 600 }}>
                            Your progress
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: 600 }}>
                            {amount - currentQuestionIndex} questions left
                        </Text>
                    </View>
                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>
                            {decodeHtml(questions[currentQuestionIndex]?.question)}
                        </Text>
                        {answers[currentQuestionIndex]?.map((answer, index) => (
                            <Pressable
                                onPress={() => toNextQuestion(index)}
                                key={answer.id}
                                style={[
                                    styles.answer,
                                    selectedAnswer === answer.text && isAnswered && !isCorrect
                                        ? styles.incorrectAnswer
                                        : selectedAnswer === answer.text && isAnswered && isCorrect
                                            ? styles.correctAnswer
                                            : null,
                                ]}
                            >
                                <Text style={styles.answerLetter}>{getLetter(index)}.</Text>
                                <Text style={styles.answerText}>{decodeHtml(answer.text)}</Text>
                            </Pressable>
                        ))}
                        {showCorrection && (
                            <View style={styles.correctionContainer}>
                                <Text style={styles.correctionText}>
                                    {isCorrect ? 'CORRECT !' : 'INCORRECT !'}
                                </Text>
                                <Text style={styles.correctAnswerText}>
                                    Correct Answer: {decodeHtml(questions[currentQuestionIndex]?.correct_answer)}
                                </Text>
                            </View>
                        )}
                    </View>
                </>
            )}
        </View>
    );
};

export default QuizScreen;

const styles = StyleSheet.create({
    quizOverContainer: {
        alignItems: 'center',
    },
    quizOverText: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 600,
        fontWeight: 'bold',
    },
    scoreContainer: {
        backgroundColor: '#FEBD1B',
        marginVertical: 30,
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderColor: '#F8004E',
        borderWidth: 0.5,
        borderRadius: 10,
    },
    scoreText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    scoreValue: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    restartButton: {
        backgroundColor: '#F8004E',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    restartButtonText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    },
    questionContainer: {
        backgroundColor: '#FEBD1B',
        marginTop: 20,
        width: '100%',
    },
    question: {
        fontWeight: '600',
        fontSize: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        textAlign: 'center',
        color: '#fff'
    },
    answer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: 0.5,
        borderRadius: 18,
        marginVertical: 15,
        marginHorizontal: 10,
        backgroundColor: '#fff',
    },
    answerText: {
        flexWrap: 'wrap',
        fontSize: 18,
    },
    answerLetter: {
        color: '#fff',
        fontSize: 20,
        padding: 16,
        borderColor: '#fff',
        borderWidth: 0.5,
        marginEnd: 15,
        backgroundColor: '#F8004E',
        fontWeight: '600',
    },
    correctAnswer: {
        backgroundColor: '#86E660',
        color: '#fff',
    },
    incorrectAnswer: {
        backgroundColor: 'red',
        color: '#fff',
    },
    correctionContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#F8004E',
        alignItems: 'center',
    },
    correctionText: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 10,
        color: '#fff',
    },
    correctAnswerText: {
        fontSize: 18,
        color: '#fff',
    },
});
