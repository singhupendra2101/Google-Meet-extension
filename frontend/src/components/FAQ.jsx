"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQComponent = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is the core feature of this extension?',
      answer: 'Our extension provides seamless, one-click attendance tracking for Google Meet, saving educators and professionals valuable time by automating a tedious manual task.'
    },
    {
      question: 'How does the installation process work?',
      answer: 'Installation is simple. Visit the Chrome Web Store, click "Add to Chrome," and grant the required permissions. The extension will automatically be available in your next Google Meet call.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Yes. Privacy is our top priority. The extension processes all data locally on your device and does not store or transmit any personal information or meeting data to external servers.'
    },
    {
      question: 'Are there any hidden costs or premium versions?',
      answer: 'The extension is completely free to use. We are committed to providing this tool to the community without charge. Future updates and features will also be included for free.'
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 sm:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            FAQs
          </h2>
          <h3 className="mt-2 text-4xl font-extrabold tracking-tighter">
            Frequently Asked Questions
          </h3>
        </motion.div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {faq.question}
                </span>
                <div className="text-blue-600">
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div> // <-- THIS CLOSING TAG WAS MISSING
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQComponent;