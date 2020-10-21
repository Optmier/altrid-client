import React from 'react';
import EyetrackingPlayer from './EyetrackingPlayer';
import seqExample from './etdata';

function PlayerExample() {
    return (
        <div>
            플레이어 예시
            <EyetrackingPlayer data={sequences} testContent={testData} />
        </div>
    );
}

console.log(seqExample);
const sequences = seqExample;
const testData = {
    title: '샘플 컨텐츠 입니다.',
    passageForRender:
        '<p>\t[1] In the southeastern Pacific Ocean, on the piece of land known as Easter Island (now a territory of Chile), stand several hundred massive stone monoliths. These carvings, called “moai,” are recognizable by their oversized heads, with their heavy brows, long noses, elongated ears, and protruding lips. While they average four meters in height and 12.5 tonnes, the largest is almost 10 meters tall and the heaviest weighs a full 86 tons. The upright sculptures are scattered around Easter Island, many installed on platforms called “ahu” along the coast, while others are more inland and several stand near the main volcanic quarry of Rano Raraku. The Rapa Nui people of the island built a total of 887 of these impressive statues between the 12th and 16th centuries. They were, it is said, symbols of religious and political authority,&nbsp;<strong>embodiments</strong>&nbsp;of powerful chiefs or ancestors which faced inland toward the island’s villages, perhaps watching over their creators, keeping them safe.</p><p><br></p><p>\t[2]&nbsp;<strong>While the very creation of such monoliths – most out of volcanic ash with stone hand chisels – is an impressive feat, what is more remarkable (not to mention mysterious) is how they were transported to their resting places.</strong>&nbsp;In the past, most researchers associated the building and transportation of the moai with widespread deforestation on the island and eventual collapse of the Rapa Nui civilization. This hypothesis is based, in part, on the fact that the pollen record suddenly disappears at the same time as the Rapa Nui people stopped constructing the moai and transporting them with the help of wooden logs. How exactly would logs facilitate the movement of the statues? Most proponents of this method believe that the people created “rollers” by arranging parallel logs on which the prone statues were pulled, or pushed.&nbsp;<strong>They</strong>&nbsp;would not have required an entire roadway of logs, since logs from the back could be placed at the front, creating a moving platform of sorts. To make it easier to roll, and keep in position, the statue would be placed on two logs arranged in a V shape.</p><p><br></p><p>\t[3] One proponent of this idea of rolling the statues in a prone position is Jo Anne Van Tilburg, of UCLA. Van Tilburg created sophisticated computer models that took into account available materials, routes, rock, and manpower, even factoring in how much the workers would have to have eaten. Her models supported the idea that rolling prone statues was the most efficient method. As further evidence, Van Tilburg oversaw the movement of a moai replica by the method she had proposed. They were successful, but evidence that it was possible is not necessarily evidence that it actually happened.</p><p><br></p><p>\t[4] Van Tilburg was not the only one to have experimented with rolling the statues. In the 1980s, archaeologist Charles Love experimented with rolling the moai in an upright position, rather than prone, on two wooden runners. Indeed, a team of just 25 men was able to move the statue a distance of 150 feet in a mere two minutes. However, the route from the stone quarries where the statues were built to the coast where they were installed was often uneven, and Love’s experiments were&nbsp;<strong>hampered</strong>&nbsp;by the tendency of the statues to tip over. While Love’s ideas were dismissed by many, the idea of the statutes tipping over along the route was consistent with the many moai found on their sides or faces beside the island’s ancient roads. And local legend held that the statues “walked” to their destinations, which would seem to support an upright mode of transportation. In fact, rolling was not the only possible way of transporting the moai in an upright position.</p><p><br></p><p>\t[5] In the 1980s, Pavel Pavel and Thor Heyerdahl had experimented with swiveling the statues forward. With one rope tied around the head and another around the base, they were able to move a five-ton moai with only eight people, and a nine-ton statue with 16. However, they abandoned their efforts when their technique proved too damaging; as they shuffled the statues forward, the bases were chipped away. This confounding factor led most to believe that an upright, rope-assisted walking method was incorrect.</p><p><br></p><p>\t[6] But many now believe that they were, in fact, transported upright. In 2012, Carl Lipo of California State University Long Beach and Terry Hunt of the University of Hawaii teamed up with archaeologist Sergio Rapu to refine the upright walking idea. They found that the statues that appeared to be&nbsp;<strong>abandoned</strong>&nbsp;in transit had bases with a curved front edge. This meant they would naturally topple forward and would need to be modified once they reached their destinations. But that curved edge also meant that they could easily be rocked forward using a small team of people and three ropes attached to the head. Indeed, their experiments demonstrated the feasibility of this method, and their theory has gained traction.</p>',
    passageForEditor:
        '{"ops":[{"insert":"\\t[1] In the southeastern Pacific Ocean, on the piece of land known as Easter Island (now a territory of Chile), stand several hundred massive stone monoliths. These carvings, called “moai,” are recognizable by their oversized heads, with their heavy brows, long noses, elongated ears, and protruding lips. While they average four meters in height and 12.5 tonnes, the largest is almost 10 meters tall and the heaviest weighs a full 86 tons. The upright sculptures are scattered around Easter Island, many installed on platforms called “ahu” along the coast, while others are more inland and several stand near the main volcanic quarry of Rano Raraku. The Rapa Nui people of the island built a total of 887 of these impressive statues between the 12th and 16th centuries. They were, it is said, symbols of religious and political authority, "},{"attributes":{"bold":true},"insert":"embodiments"},{"insert":" of powerful chiefs or ancestors which faced inland toward the island’s villages, perhaps watching over their creators, keeping them safe.\\n\\n\\t[2] "},{"attributes":{"bold":true},"insert":"While the very creation of such monoliths – most out of volcanic ash with stone hand chisels – is an impressive feat, what is more remarkable (not to mention mysterious) is how they were transported to their resting places."},{"insert":" In the past, most researchers associated the building and transportation of the moai with widespread deforestation on the island and eventual collapse of the Rapa Nui civilization. This hypothesis is based, in part, on the fact that the pollen record suddenly disappears at the same time as the Rapa Nui people stopped constructing the moai and transporting them with the help of wooden logs. How exactly would logs facilitate the movement of the statues? Most proponents of this method believe that the people created “rollers” by arranging parallel logs on which the prone statues were pulled, or pushed. "},{"attributes":{"bold":true},"insert":"They"},{"insert":" would not have required an entire roadway of logs, since logs from the back could be placed at the front, creating a moving platform of sorts. To make it easier to roll, and keep in position, the statue would be placed on two logs arranged in a V shape.\\n\\n\\t[3] One proponent of this idea of rolling the statues in a prone position is Jo Anne Van Tilburg, of UCLA. Van Tilburg created sophisticated computer models that took into account available materials, routes, rock, and manpower, even factoring in how much the workers would have to have eaten. Her models supported the idea that rolling prone statues was the most efficient method. As further evidence, Van Tilburg oversaw the movement of a moai replica by the method she had proposed. They were successful, but evidence that it was possible is not necessarily evidence that it actually happened.\\n\\n\\t[4] Van Tilburg was not the only one to have experimented with rolling the statues. In the 1980s, archaeologist Charles Love experimented with rolling the moai in an upright position, rather than prone, on two wooden runners. Indeed, a team of just 25 men was able to move the statue a distance of 150 feet in a mere two minutes. However, the route from the stone quarries where the statues were built to the coast where they were installed was often uneven, and Love’s experiments were "},{"attributes":{"bold":true},"insert":"hampered"},{"insert":" by the tendency of the statues to tip over. While Love’s ideas were dismissed by many, the idea of the statutes tipping over along the route was consistent with the many moai found on their sides or faces beside the island’s ancient roads. And local legend held that the statues “walked” to their destinations, which would seem to support an upright mode of transportation. In fact, rolling was not the only possible way of transporting the moai in an upright position.\\n\\n\\t[5] In the 1980s, Pavel Pavel and Thor Heyerdahl had experimented with swiveling the statues forward. With one rope tied around the head and another around the base, they were able to move a five-ton moai with only eight people, and a nine-ton statue with 16. However, they abandoned their efforts when their technique proved too damaging; as they shuffled the statues forward, the bases were chipped away. This confounding factor led most to believe that an upright, rope-assisted walking method was incorrect.\\n\\n\\t[6] But many now believe that they were, in fact, transported upright. In 2012, Carl Lipo of California State University Long Beach and Terry Hunt of the University of Hawaii teamed up with archaeologist Sergio Rapu to refine the upright walking idea. They found that the statues that appeared to be "},{"attributes":{"bold":true},"insert":"abandoned"},{"insert":" in transit had bases with a curved front edge. This meant they would naturally topple forward and would need to be modified once they reached their destinations. But that curved edge also meant that they could easily be rocked forward using a small team of people and three ropes attached to the head. Indeed, their experiments demonstrated the feasibility of this method, and their theory has gained traction.\\n"}]}',
    timeLimit: 180,
    problemDatas: [
        {
            category: 2,
            type: 'multiple-choice',
            textForRender:
                '<p>1.&nbsp;Which of the following best expresses the essential information in the highlighted sentence? Incorrect answer choices change the meaning in important ways or leave out essential information.</p><p>While the very creation of such monoliths – most out of volcanic ash with stone hand chisels – is an impressive feat, what is more remarkable (not to mention mysterious) is how they were transported to their resting places.</p>',
            textForEditor:
                '{"ops":[{"insert":"1. Which of the following best expresses the essential information in the highlighted sentence? Incorrect answer choices change the meaning in important ways or leave out essential information.\\nWhile the very creation of such monoliths – most out of volcanic ash with stone hand chisels – is an impressive feat, what is more remarkable (not to mention mysterious) is how they were transported to their resting places.\\n"}]}',
            commentsForRender: '',
            commentsForEditor: `{"ops":[{"insert":"\n"}]}`,
            selections: {
                1: 'The transportation of the moai is both remarkable and mysterious, but not as impressive as the actual creation of the statutes.',
                2: 'The moai were carved with stone hand chisels, which is an impressive accomplishment, but it is still unknown whether the people actually transported them.',
                3: 'The creation of the moai is amazing, but not as amazing as how they were transported.',
                4: 'The transportation of the moai is remarkable, mysterious, and as impressive as their creation with simple hand tools.',
                5: '',
            },
            answer: 2,
            score: 1,
        },
        {
            category: 9,
            type: 'short-answer',
            textForRender:
                '<p>2.&nbsp;In paragraph 2, what does the author say about past theories of how the moai were transported from quarries to their resting places?</p>',
            textForEditor:
                '{"ops":[{"insert":"2. In paragraph 2, what does the author say about past theories of how the moai were transported from quarries to their resting places?\\n"}]}',
            commentsForRender: '',
            commentsForEditor: `{"ops":[{"insert":"\n"}]}`,
            selections: {
                1: 'The theories claimed that that use of natural resources for transporting moai had devastating effects on the land and society.',
                2: 'The theories relied on evidence of log roadways that remained long after the Rapa Nui people had disappeared.',
                3: 'The theories were supported by oral accounts of the use of wood by the Rapa Nui peoples at the time the moai were constructed and transported.',
                4: 'The theories were based on inaccurate estimates of the amount of wood required to transport moai over long distances.',
                5: '',
            },
            answer: 'ACB',
            score: 2,
        },
        {
            category: 6,
            type: 'multiple-choice',
            textForRender: "<p>3.&nbsp;The word 'they' in paragraph&nbsp;2&nbsp;refers to:</p>",
            textForEditor: '{"ops":[{"insert":"3. The word \'they\' in paragraph 2 refers to:\\n"}]}',
            commentsForRender: '',
            commentsForEditor: `{"ops":[{"insert":"\n"}]}`,
            selections: {
                1: 'proponents.',
                2: 'the people.',
                3: 'rollers.',
                4: 'statues.',
                5: '',
            },
            answer: 4,
            score: 1,
        },
    ],
};

export default React.memo(PlayerExample);
