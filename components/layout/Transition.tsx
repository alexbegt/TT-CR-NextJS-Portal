import type { ReactNode } from "react";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { useRouter } from "next/router";

import transitionStyles from '@/styles/transition.module.scss'

const variants = {
    fadeIn: {
        y: 100,
        opacity: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: "easeInOut"
        }
    },
    inactive: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: "easeInOut"
        }
    },
    fadeOut: {
        opacity: 0,
        y: -100,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: "easeInOut"
        }
    }
};

type TransitionProps = {
    children: ReactNode;
}

export default function Transition({ children }: TransitionProps) {
    const { asPath } = useRouter();

    const shouldReduceMotion = useReducedMotion();

    return (
        <div className={transitionStyles.transition}>
            <AnimatePresence initial={false} mode='wait'>
                <motion.div
                    style={{ position: "relative" }}
                    key={asPath}
                    variants={!shouldReduceMotion ? variants : undefined}
                    initial="fadeIn"
                    animate="inactive"
                    exit="fadeOut"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};