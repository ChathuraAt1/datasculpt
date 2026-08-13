'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FinalCTA() { return <section className="mx-auto max-w-7xl px-5 pb-24 pt-8 lg:px-8 lg:pb-32"><motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="rounded-3xl border border-brand-300/70 bg-gradient-to-r from-brand-50 via-brand-100/75 to-brand-50 p-8 text-center shadow-brand sm:p-12"><p className="eyebrow">READY FOR THE NEXT STEP?</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">Make your data foundation ready for what&apos;s next.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">See how DataSculpt can help your teams create more value from the data they already have.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button href="/products/">Explore the platform <ArrowRight size={16} /></Button><Button href="/contact/" variant="ghost">Explore your use case</Button></div></motion.div></section>; }
