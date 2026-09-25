import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {ScormRuntime} from '../dist/runtime.js';
import {PEOPLE,newAttempt,summary,latestInteractions} from '../dist/domain.js';
const course=JSON.parse(readFileSync('dist/samples/catalog.json')).find(c=>c.id==='genially-questions');
async function launchVendor(attempt){
  const runtime=new ScormRuntime(attempt,course);
  const window={API:runtime.api,addEventListener(){},console:{log(){}}};
  window.parent=window;window.top=window;
  const context=vm.createContext({window,console:window.console});
  for(const file of ['scorm-config.js','scorm.js'])vm.runInContext(readFileSync('dist/courses/genially-questions/app/'+file,'utf8'),context);
  return {runtime,wrapper:await window.geniallyElearningWrapper,ids:Object.keys(JSON.parse(window.geniallyElearningQuestionsPresetData.scoringAnswerIds))};
}
test('unmodified Genially SCORM wrapper reports answers, score, completion and resume through our API',async()=>{
  const attempt=newAttempt(course,PEOPLE[0]);
  let {wrapper,ids}=await launchVendor(attempt);
  await wrapper.start({});
  assert.equal(summary(attempt,course).score,0);
  ids.forEach((id,i)=>wrapper.onQuizInteractiveQuestionAnswer({interactiveQuestionId:id,interactiveQuestionTitle:`Question ${i+1}`,answerIds:['answer-'+i],type:'quiz',studentAnswers:[i===0?'Venus':'Earth'],isCorrect:i!==0,saveAnswersInSuspendData:true,correctAnswers:['Earth']}));
  wrapper.onSlideChanged(10,'bookmark-10','slide-10','Results');
  wrapper.end();
  assert.equal(summary(attempt,course).score,90);
  assert.equal(summary(attempt,course).success,'passed');
  assert.equal(summary(attempt,course).questions,10);
  assert.equal(summary(attempt,course).wrong,1);
  assert.equal(latestInteractions(attempt)[0].response,'Venus');
  assert.equal(latestInteractions(attempt)[0].correct,'Earth');
  assert.equal(attempt.commitCount,11);
  ({wrapper}=await launchVendor(attempt));
  const position=await wrapper.start({});
  assert.equal(position.bookmark,'bookmark-10');
  assert.equal(wrapper.answeredQuestions.length,10);
  assert.equal(wrapper.getScore(),90);
  wrapper.end();
});
