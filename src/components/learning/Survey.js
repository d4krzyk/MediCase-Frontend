import { useCallback, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Input } from "../common/Input";

const surveyJson = {
    locale: "pl",
    title: "Ankieta ewalucyjna",
    completedHtml: "<h3>Dziękujamy za wypełnienie ankiety!</h3>",
    loadingHtml: "<h3>Ładowanie ankiety...</h3>",
    widthMode: "responsive",
    pages: [
        {
            name: 'Page_1',
            elements: [
                {
                    type: "rating",
                    name: "easy",
                    title: "Jak oceniasz łatwość posługiwania się/intuicyjność aplikacji?",
                    rateMin: '1',
                    rateMax: '5',
                },
                {
                    type: "rating",
                    name: "layout",
                    title: "Jak oceniasz układ treści?",
                    rateMin: '1',
                    rateMax: '5',
                },
                {
                    type: "rating",
                    name: "socrates",
                    title: "Na ile aplikacja pomocna jest w zapamiętaniu mnemotechniki SOCRATES?",
                    rateMin: '1',
                    rateMax: '5',
                },
                {
                    type: "boolean",
                    name: "daily_use",
                    labelTrue: "Tak",
                    labelFalse: "Nie",
                    title: "Czy skorzystałeś z aplikacji w codziennej praktyce lekarskiej?",
                    renderAs: 'radio'
                },
                {
                    type: "comment",
                    name: 'opinion',
                    title: "Napisz opinię, lub opisz w jaki sposób moglibyśmy ulepszyć naszą aplikację:"
                },
            ]
        }
    ]
}

function preprocessSurvey(survey){

    return {
        ...survey,
        pages:
        [
            ...survey.pages,
            {
                name: 'final_page'
            }
        ]
    }
}

export function SurveyContainer() {

    return (
        <div className='flex-fill py-4'>
            <AppSurvey />
        </div>
    )
}

function AppSurvey({ survey = preprocessSurvey(surveyJson) }) {

    const [surveyData, setSurveyData] = useState({})
    const [currentPage, setCurrentPage] = useState(0)

    const modifySurveyData = useCallback((key, value) => {
        setSurveyData(oldSurveyData => {
            let newSurveyData = { ...oldSurveyData }
            newSurveyData[key] = value
            return newSurveyData
        })
    }, [])

    const saveResults = useCallback((data) => {
        
    }, [])

    const navigateToNextPage = useCallback((key, value) => {
        let newSurveyData = { ...surveyData }
        newSurveyData[key] = value

        const newPage = currentPage + 1
        if(survey.pages[newPage].name === 'final_page'){
            saveResults(newSurveyData)
        }
        setCurrentPage(newPage)
    }, [currentPage, saveResults, survey, surveyData])
   
    return (
                <SurveyPage page={survey.pages[currentPage]}
                modifySurveyData={modifySurveyData} navigateToNextPage={navigateToNextPage}/>
    )
}

function SurveyPage({ page, modifySurveyData, navigateToNextPage }) {

    const elements = page.elements
    const [pageData, setPageData] = useState({})

    const modifyPageData = useCallback((key, value) => {
        setPageData(oldAnswerData => {
            let newAnswerData = { ...oldAnswerData }
            newAnswerData[key] = value
            return newAnswerData
        })
    }, [])

    if(page.name === 'final_page') {
        return(
            <div className='container bg-white border border-3 rounded-2 h-100'>
                <SurveyFinalPage/>
            </div>
        )
    }

    return (
        <div className='container bg-white border border-3 rounded-2'>
            {elements.map((element, index) => {

                let elementComponent

                if (element.type === 'rating') {
                    elementComponent = <SurveyRating element={element} modifyPageData={modifyPageData} />
                } else if (element.type === 'boolean') {
                    elementComponent = <SurveyYesNo element={element} modifyPageData={modifyPageData} />
                } else if (element.type === 'comment') {
                    elementComponent = <SurveyComment element={element} modifyPageData={modifyPageData} />
                }

                return (
                    <Question key={index} title={element.title}>
                        {elementComponent}
                    </Question>
                )
            })}
            <div className='d-flex justify-content-end py-3'>
                <Button className='px-4' onClick={() => {
                    modifySurveyData(page.name, pageData)
                    navigateToNextPage(page.name, pageData)
                }}>
                    Dalej
                </Button>
            </div>
        </div>
    )
}

function Question({ title, children }) {

    return (
        <div className='p-3 border-bottom'>
            <div className='py-1 h3 fw-normal'>
                {title}
            </div>
            {children}
        </div>
    )
}

function SurveyFinalPage(){

    return (
        <div className='d-flex h-100 justify-content-center align-items-center display-5 text-center'>
            Dziękujemy za wypełnienie ankiety!
        </div>
    )
}

function SurveyComment({ element, modifyPageData }) {

    const [comment, setComment] = useState('')

    return (
        <div>
            <Input as='textarea' rows={6} value={comment}
                setValue={(value) => {
                    setComment(value)
                    modifyPageData(element.name, value)
                }} />
        </div>
    )
}

function SurveyYesNo({ element, modifyPageData }) {

    return (
        <div>
            <Form.Check type={'radio'} id={`yes`} label={`Tak`} name='radio' className='m-2'
                onChange={() => {
                    modifyPageData(element.name, true)
                }}
            />
            <Form.Check type={'radio'} id={`yes`} label={`Nie`} name='radio' className='m-2'
                onChange={() => {
                    modifyPageData(element.name, true)
                }}
            />
        </div>
    )
}

function SurveyRating({ element, modifyPageData }) {

    const [chosenRatingIndex, setChosenRatingIndex] = useState(undefined)

    const min = parseInt(element.rateMin) ?? 1
    const max = parseInt(element.rateMax) ?? 5
    const ratingarray = Array.from({ length: max - min + 1 }, (_, index) => index + min);

    return (
        <div className='d-flex py-2 justify-content-center justify-content-lg-start'>
            {
                ratingarray.map((rating, index) => {
                    return (
                        <RatingButton key={index} value={rating} selected={index === chosenRatingIndex}
                            onClick={() => {
                                setChosenRatingIndex(index)
                                modifyPageData(element.name, ratingarray[index])
                            }} />
                    )
                }
                )
            }
        </div>
    )
}

function RatingButton({ selected, value, onClick }) {

    return (
        <Button variant='light' className={`rounded-2 border ${selected ? 'bg-secondary' : ''} p-2 px-3 mx-1`} onClick={onClick}>
            {value}
        </Button>
    )
}
