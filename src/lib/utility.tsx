import { ContentContainer } from '../components/learning/ContentContainer'
import { Content } from '../components/learning/Content'
import { Glossary, GlossaryEntry } from '../components/learning/Glossary'
import { Test, TestQuestion } from '../components/learning/LanguageTest'
import { QuestionsList } from '../components/learning/QuestionsList'
import { NodeType, ServerNodeTranslation } from '../network/lib/entity'
import { ContentNavigation, ContentNavigationItem } from '../components/learning/ContentNavigation'

export function getFirstFileWithType(node: ServerNodeTranslation | undefined, fileType: string) : string | undefined{
    return node?.files?.find(f => f.fileType === fileType)?.filePath
}

export const NodeMapper = new Map<number, NodeType>()

NodeMapper.set(3, {
    textFields: [{name:'MainTitle', type: 'f'}],
    fileFields: ['image'],
    mapper: (node, moderator) => {
        if(moderator && node.isPreview){
            return <ContentNavigationItem node={node} moderator={moderator}/>
        }
        return <ContentNavigation node={node} moderator={moderator}/>
    },
    preprocess: (translation) => {},
    isChildValid: (typeId) => true
})
NodeMapper.set(4, {
    textFields: [{name:'MainTitle', type: 'f'}, {name:'Paragraphs', type: 'f'}],
    fileFields: ['video', 'image', 'voice'],
    mapper: (node, moderator) => (<Content node={node} moderator={moderator} />),
    preprocess: (translation) => {},
    isChildValid: (typeId) => false
})
NodeMapper.set(5, {
    textFields: [{name:'MainTitle', type: 'q'}],
    fileFields: ['voice'],
    mapper: (node, moderator) => <QuestionsList isRoot={false} node={node}  moderator={moderator} />,
    preprocess: (translation) => {},
    isChildValid: (typeId) => typeId === 5
})
NodeMapper.set(6, {
    textFields: [{name:'MainTitle', type: 'f'}],
    fileFields: [],
    mapper: (node, moderator) => <ContentContainer node={node}  moderator={moderator} />,
    preprocess: (translation) => {},
    isChildValid: (typeId) => typeId === 4
})
NodeMapper.set(11, {
    textFields: [{name:'MainTitle', type: 'f'}],
    fileFields: ['image'],
    mapper: (node, moderator) => {
        if(node.isPreview){
            return <ContentNavigationItem node={node} moderator={moderator} />
        }
        return <Glossary node={node}  moderator={moderator} />
    },
    preprocess: (translation) => {},
    isChildValid: (typeId) => typeId === 12
})
NodeMapper.set(12, {
    textFields: [{name:'MainTitle', type: 'f'}],
    fileFields: ['voice'],
    mapper: (node, moderator) => <GlossaryEntry node={node}  moderator={moderator} />,
    preprocess: (translation) => {},
    isChildValid: (typeId) => false
})

const digestQuestionData = (data: any) => {
    const tokens = data.question.split('|')
    return {
        description: data.description,
        allAnswers: JSON.parse(data.answers),
        tokens: tokens,
        places: tokens.filter((tok: string[]) => tok.at(0) === '#').map((tok: string) => parseInt(tok.slice(1)))

    }
}

const testPreprocess = (translation : ServerNodeTranslation | undefined) => {
    if (translation === undefined) return undefined
    let data
    try {
        data = JSON.parse(translation.paragrahps)
        data = digestQuestionData(data)
    } catch (e) {
        return {
            isError: true,
            error: e
        }
    }
    return {
        isError: false,
        ...data
    }
}

NodeMapper.set(13, {
    textFields: [{name:'MainTitle', type: 'f'}],
    fileFields: ['image'],
    mapper: (node, moderator) => <Test node={node}  moderator={moderator}/>,
    preprocess: testPreprocess,
    isChildValid: (typeId) => typeId === 14
})

NodeMapper.set(14, {
    textFields: [{name:'testQuestion', type: 'f'}, {name:'isCustom', type: 'f'}],
    fileFields: [],
    mapper: (node, moderator) => <TestQuestion node={node}  moderator={moderator} answered={() => {}} currentQuestionNumber={0} questionCount={1}/>, 
    preprocess: testPreprocess,
    isChildValid: (typeId) => false
})

NodeMapper.set(15, {
    textFields: [{name:'MainTitle', type: 'f'}],
    fileFields: ['image'],
    mapper: (node, moderator) => <QuestionsList isRoot={true} node={node} moderator={moderator} />,
    preprocess : (translation) => {},
    isChildValid: (typeId) => typeId === 5
})

 