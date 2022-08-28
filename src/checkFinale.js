function buildTranspose(dir, n) {
    switch (dir) {
        case "left":
            return (i, j) => ({ i, j });
        case "right":
            return (i, j) => ({ i, j: n - 1 - j });
        case "up":
            return (i, j) => ({ i: j, j: i });
        case "down":
            return (i, j) => ({ i: n - 1 - j, j: i });
    }
}


function checkFinal(mat) {
    const n = 4;
    let isFinal = true;
    let isFilled = true;
    let dirs = ["left", "right", "up", "down"]

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (mat[i][j].value === 0) {
                isFilled = false
                isFinal = false
            }
        }
    }

    if (isFilled) {
        for (let dir of dirs) {

            const transpose = buildTranspose(dir, n);

            for (let i = 0; i < n; i++) {
                for (let j = 1; j < n; j++) {

                        let { i: ai, j: aj } = transpose(i, j);
                        let { i: pai, j: paj } = transpose(i, j - 1);

                        if (mat[pai][paj].value === mat[ai][aj].value) {
                            isFinal = false
                        }
                    
                }
            }

        }

    }

    return isFinal
}

export {
    checkFinal
}