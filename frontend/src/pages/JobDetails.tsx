import { motion } from "motion/react";

function JobDetails(){
    return <motion.h1 
    initial = {{x:-100}}
    animate = {{x:100}}
    exit={{x:-100}}

    >Job Details</motion.h1>
}

export default JobDetails;