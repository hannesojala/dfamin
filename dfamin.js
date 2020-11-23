// dfamin: minimizes input deterministic finite automata

let alphabet_length = 0;
let transition_function = [];
let start_state = 0;
let accept_states = [];

function defaults() {
    document.getElementById("alen").value = "2";
    document.getElementById("tfun").value = "3-2,3-5,2-6,2-1,5-4,5-3,5-0";
    document.getElementById("q0").value = "0";
    document.getElementById("qa").value = "0,1";
}

function getDFA() {
    alphabet_length = document.getElementById("alen").valueAsNumber;
    transition_function = [];
    let tfunc = document.getElementById("tfun").value.split(",");
    for (let i = 0; i < tfunc.length; i++) {
        transition_function.push(tfunc[i].split("-").map(x=>+x));
    }
    start_state = document.getElementById("q0").valueAsNumber;
    accept_states = document.getElementById("qa").value.split(",").map(x=>+x);
}

function dfamin() {
    // Filter out unreachable states
    let reachable_states = bfs_reachable(transition_function, start_state, []);
    console.log("Reachable states: " + reachable_states);

    // Initial partition between accept and non-accept states
    let partition_queue = [accept_states, setDiff(reachable_states, accept_states)];
    let distinct_states = [];
    
    // For each set
    for (let i = 0; i < partition_queue.length; i++) {
        console.log("Distinguishing partition: " + partition_queue[i]);
        let set = partition_queue[i];
        let isDistinct = true;
        // For each alpha
        for (let n = 0; n < alphabet_length; n++) {
            // Find states which transition to this set for character n
            let self_transition_set = [];
            for (let j = 0; j < set.length; j++) {
                let state = set[j];
                if (set.includes(transition_function[state][n])) {
                    self_transition_set.push(state)
                }
            }
            console.log("Self transition on char " + n + " for set " + set + ": " + self_transition_set);
            if (self_transition_set.length > 0 && self_transition_set.length < set.length) {
                let new_set = setDiff(set, self_transition_set);
                console.log("New partition: " + self_transition_set);
                console.log("New partition: " + new_set);
                partition_queue.push(self_transition_set);
                partition_queue.push(new_set);
                isDistinct = false;
            }
            else {
                console.log("Set is distinct on char " + n + ".");
            }
        }
        if (isDistinct) {
            console.log("Set is distinct on all chars.");
            distinct_states.push(set);
        }
    }

    console.log("Distinct states: ");
    console.log(distinct_states);
}

// graph is 2d array of nodes and their connections
function bfs_reachable(graph, root, found) {
    found.push(root);
    // For every roots neighbors
    let neighbors = graph[root];
    for (let i = 0; i < neighbors.length; i++) {
        // if it has not been found
        if (!found.includes(neighbors[i])) {
            found.concat(bfs_reachable(graph, neighbors[i], found));
        }
    }
    return found;
}

function setDiff(A, B) {
    let diff = [];
    for (let i = 0; i < A.length; i++) {
        if (!B.includes(A[i])) {
            diff.push(A[i]);
        }
    }
    return diff;
}