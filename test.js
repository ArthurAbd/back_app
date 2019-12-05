function test(stones, beetles) {
    if (stones < beetles) return console.log('Слишком много жуков');
    const queue = [stones];
    const map = {};
    map[stones] = 1;
    let leftSegment = null;
    let rightSegment = null;
    let nextSegment = null;
    let step = 0;
    for (let i = 0; i < beetles; i += 1 ) {
        if (!map[queue[step]]) {
            step += 1;
        }
        nextSegment = queue[step];
        map[queue[step]] -= 1;
        leftSegment = Math.floor((nextSegment - 1) / 2);
        rightSegment = Math.ceil((nextSegment - 1) / 2);

        if (map[rightSegment]) {
            map[rightSegment] += 1;
        } else {
            map[rightSegment] = 1;
            queue.push(rightSegment);
        }
        
        if (map[leftSegment]) {
            map[leftSegment] += 1;
        } else {
            map[leftSegment] = 1;
            queue.push(leftSegment);
        }
    }
    return console.log(`С левой стороны: ${leftSegment}, с правой стороны: ${rightSegment}`)
}

test(8, 1);
test(8, 2);
test(8, 3);
test(4000000000, 4000000000);