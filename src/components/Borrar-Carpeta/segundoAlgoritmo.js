const twoSumLessThank = function (A, K){
    let max = -1;
    for(let i = 0; i < A.length; i++){
        for(let j = i +1; j < A.length; j++){
            const currSum = A[i] + A[j];
            if(currSum < K && currSum > max){
                max = currSum
            }
        }
    }

    return max
}

let A = [34,23,1,24,75,33,54,8];
let K = 60;

let array = [10,20,30]

let Kk = 15

console.log(twoSumLessThank(A, K))
console.log(twoSumLessThank(array, Kk))
