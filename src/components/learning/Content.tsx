import { Sanitized } from '../common/Sanitized';
import { ServerNodeData } from '../../network/lib/entity'
import { motion } from "framer-motion";
import Flag from 'react-flagkit';
import { useAppStore } from '../../lib/store';
import { useState } from "react";
import { RemoteVideo } from './RemoteVideo';
import { RemoteImage } from './RemoteImage';
import { SoundButton } from "./SoundButton";
import { ErrorHandler } from '../common/ErrorHandler';
interface RuleProps {
  node: ServerNodeData,
  moderator: boolean | undefined
}

const slideAnimationY = {
  hidden: {
    opacity: 0,
    y: "10%",
  },
  visible: {
    opacity: 1,
    y: "0%",
    transition: {
      duration: "0.9",
      ease: "easeOut"
    }
  }
};

function TitleProps(show: boolean) {
  return {
    initial: { opacity: 0, x: "-5%" },
    animate: { opacity: show ? 1 : 0, x: show ? "0%" : "-5%", transition: { x: { duration: "0.24", ease: "easeOut" } } },
    className: `flex-fill h3 ps-2 ${show ? '' : 'd-none'}`
  }
}

function SoundButtonProps(show: boolean) {
  return {
    initial: { opacity: 0, x: 0 },
    animate: { opacity: show ? 1 : 0, x: show ? "0%" : "5%" }
  }
}

interface TranslationButtonProps {
  show: boolean,
  toggleNative: () => void,
  countryCode: string
}

function TranslationButton({ show: isNative, toggleNative, countryCode }: TranslationButtonProps) {
  return (
    <motion.button onClick={() => toggleNative()}
      className={`border px-2 bg-background bg-gradient rounded  ${isNative ? 'py-1' : 'd-none'}`}>
      <motion.div
        initial={{ opacity: 0, x: "20%" }}
        animate={{ opacity: isNative ? 1 : 0, x: isNative ? "0%" : "20%", transition: { x: { type: "spring", stiffness: 200 } } }}
      >
        <Flag country={countryCode} size={34} />
      </motion.div>
    </motion.button>
  )
}

function VisualContentProps(hide: boolean) {
  return {
    className: ` justify-content-center ${hide ? 'd-none p-0' : 'd-flex '}`,
    initial: { opacity: 0, y: "10%" },
    animate: { opacity: hide ? 0 : 1, y: hide ? "10%" : "0%" }
  }
}

function TextContentProps(isNative: boolean) {
  return {
    initial: { opacity: 0, y: "10%" },
    animate: { opacity: isNative ? 1 : 0, y: isNative ? "0%" : "10%", },
    className: `card-body ${isNative ? 'py-2' : 'd-none'}`
  }
}

export function Content({ node, moderator }: RuleProps) {
  const config = useAppStore(store => moderator ? store.moderatorConfig : store.config);
  const [isNative, setIsNative] = useState(true)

  if(config === null){
      return <ErrorHandler error='No language configuration detected' />
  }

  const native = node.entityTranslations.at(0)
  const foreign = node.entityTranslations.at(1)


  const nativeVideoPath = native?.files?.find(f => f.fileType === 'video')?.filePath
  const foreignVideoPath = foreign?.files?.find(f => f.fileType === 'video')?.filePath

  const nativeImagePath = native?.files?.find(f => f.fileType === 'image')?.filePath
  const foreignImagePath = foreign?.files?.find(f => f.fileType === 'image')?.filePath

  const nativeSoundPath = native?.files?.find(f => f.fileType === 'voice')?.filePath
  const foreignSoundPath = foreign?.files?.find(f => f.fileType === 'voice')?.filePath

  const moderatorCountryCode = native?.countryCode
  const nativeCode = moderatorCountryCode ?? config.nativeCode
  const foreignCode = moderatorCountryCode ?? config.foreignCode

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={slideAnimationY}
      className="card bg-white d-flex flex-column p-1 mx-0 my-0 mb-2 mb-lg-4" style={{ wordBreak: 'break-word' }}>
      <div className={` ${node.entityTranslations[0]?.mainTitle && isNative ? "border-bottom border-3 border-light" : "p-1"} 
      ${foreign?.mainTitle && !isNative ? "border-bottom border-3 border-light" : "p-1"}   d-flex align-items-center text-wrap`} >
        {/*TITLE CONTENT*/}
        <motion.div {...TitleProps(isNative)}>
          {native?.mainTitle}
        </motion.div>
        <motion.div {...TitleProps(!isNative)}>
          {foreign?.mainTitle}
        </motion.div>

        {/*SOUND BUTTON CONTENT*/}
        <div className={`${isNative ? '' : 'd-none'}`}>
          <motion.div {...SoundButtonProps(isNative)}>
            <SoundButton filePath={nativeSoundPath} className={`btn m-2 p-2 my-0 ${(nativeSoundPath) ? "btn-primary pointer " : "d-none"}`} moderator={moderator} />
          </motion.div>
        </div>
        <div className={`${isNative ? 'd-none' : ''}`}>
          <motion.div {...SoundButtonProps(!isNative)}>
            <SoundButton filePath={foreignSoundPath} className={`btn m-2 p-2 my-0 ${(foreignSoundPath) ? "btn-primary pointer " : "d-none"}`} moderator={moderator} />
          </motion.div>
        </div>

        <TranslationButton show={isNative} toggleNative={() => setIsNative(false)} countryCode={nativeCode} />
        <TranslationButton show={!isNative} toggleNative={() => setIsNative(true)} countryCode={foreignCode} />
      </div>

      <motion.div {...VisualContentProps(isNative)}>
        <RemoteVideo filePath={foreignVideoPath} moderator={moderator} />
      </motion.div>
      <motion.div {...VisualContentProps(!isNative)}>
        <RemoteVideo filePath={nativeVideoPath} moderator={moderator} />
      </motion.div>

      <motion.div  {...VisualContentProps(isNative)}>
        <RemoteImage filePath={foreignImagePath} moderator={moderator} />
      </motion.div>
      <motion.div  {...VisualContentProps(!isNative)}>
        <RemoteImage filePath={nativeImagePath} moderator={moderator} />
      </motion.div>

      {/*TEXT CONTENT*/}
      <motion.div {...TextContentProps(isNative)}>
        <Sanitized text={node.entityTranslations[0]?.paragrahps} className='' />
      </motion.div>
      <motion.div {...TextContentProps(!isNative)}>
        <Sanitized text={node.entityTranslations[1]?.paragrahps} className='' />
      </motion.div>
    </motion.div>
  );
}