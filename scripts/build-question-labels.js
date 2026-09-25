import {readFileSync,writeFileSync} from 'node:fs';import vm from 'node:vm';
const rows={};const context={QUESTION_TYPE_CHOICE:'choice',QUESTION_TYPE_NUMERIC:'numeric',QUESTION_TYPE_TF:'true-false',test:{AddQuestion(q){rows[q.id]=q}},Question:function(id,description,type,choices,correct,objective){Object.assign(this,{id,description,type,choices,correct,objective})}};
for(const dir of ['Playing','Etiquette','Handicapping','HavingFun'])vm.runInNewContext(readFileSync(`dist/courses/golf/${dir}/questions.js`,'utf8'),context,{timeout:1000});
writeFileSync('dist/samples/question-labels.json',JSON.stringify(rows,null,2));
