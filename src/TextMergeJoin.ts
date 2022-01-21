/**
 * In our app we have regions of text that may or not be contiguous.
 *
 * The text is given back as rectangles with x, y, width, and height properties.
 *
 * If the x, y, width, and height are close enough, we can assume they're the same word.
 *
 * Sometimes our rectangles are word fragments NOT the whole word so we need to join the words
 * again to form entire sentences.
 *
 * The test data has examples of what these partial regions would look like.
 */
export namespace TextMergeJoin {

    export interface IPDFTextWord {
        readonly pageNum: number;
        readonly x: number;
        readonly y: number;
        readonly width: number;
        readonly height: number;
        readonly str: string;
    }

    interface ISpanCandidate {
        pageNum: number;
        y: number;
        words: Array<IPDFTextWord>
    }

    /**
     *
     */
    export function doMergeWords(data: ReadonlyArray<IPDFTextWord>): ReadonlyArray<IPDFTextWord> {
        const epsilon = 0.25; 

        const possibleSpans = new Array<ISpanCandidate>(); 

        data.forEach(word => {
            let existingSpan = possibleSpans.find(it => it.pageNum == word.pageNum && Math.abs(it.y - word.y) < epsilon); 
            if(existingSpan == null) {
                existingSpan = {
                    pageNum: word.pageNum, 
                    y: word.y, 
                    words: []
                }
                possibleSpans.push(existingSpan)
            }

            existingSpan.words.push(word);
        })

        let ret = new Array<IPDFTextWord>()

        possibleSpans.forEach(span => {

            if(span.words.length == 0) {
                return;
            }

            span.words.sort((a, b)=> a.x - b.x)
            const mergedWords = new Array();
            mergedWords.push({...span.words[0]})

            let wordIdx = 0;
            let nextIdx = 1; 
            while(true) {
                let currWord = mergedWords[wordIdx];
                let nextWord = span.words[nextIdx]; 

                if(!currWord || !nextWord) {
                    break; 
                }

                if(Math.abs(currWord.x + currWord.width - nextWord.x) < epsilon) {
                    currWord.str = `${currWord.str}${nextWord.str}`
                    currWord.width = currWord.width + nextWord.width; 
                    nextIdx++; 
                } else {
                    mergedWords.push({...nextWord})
                    wordIdx++; 
                    nextIdx++;
                }
            }

            ret = [...ret, ...mergedWords]; 
            
        })


        return ret;
    }

}
