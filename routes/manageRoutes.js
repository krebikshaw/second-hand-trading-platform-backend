const express = require('express');
const manageRouter = express.Router();
const { checkAuth } = require('../middlewares/auth');
const manageController = require('../controllers/manageController');

manageRouter.get('/rules', manageController.getAllRules);
manageRouter.get('/rules/:id', manageController.getRule);
manageRouter.post('/rules/new', checkAuth('isAdmin'), manageController.addRule);
manageRouter.patch('/rules/:id', checkAuth('isAdmin'), manageController.editRule);
manageRouter.delete('/rules/:id', checkAuth('isAdmin'), manageController.deleteRule);

manageRouter.get('/faqs', manageController.getAllFaqs);
manageRouter.get('/faqs/:id', manageController.getFaq);
manageRouter.post('/faqs/new', checkAuth('isAdmin'), manageController.addFaq);
manageRouter.patch('/faqs/:id', checkAuth('isAdmin'), manageController.editFaq);
manageRouter.delete('/faqs/:id', checkAuth('isAdmin'), manageController.deleteFaq);

manageRouter.get('/faq-categories', manageController.getAllFaqCategories);
manageRouter.post('/faq-categories/new', checkAuth('isAdmin'), manageController.addFaqCategory);
manageRouter.patch('/faq-categories/:id', checkAuth('isAdmin'), manageController.editFaqCategory);
manageRouter.delete('/faq-categories/:id', checkAuth('isAdmin'), manageController.deleteFaqCategory);

manageRouter.post('/mails', manageController.addMail);
manageRouter.get('/mails', checkAuth('isAdmin'), manageController.getAllMails);
manageRouter.get('/mails/:id', checkAuth('isAdmin'), manageController.getMail);

manageRouter.patch('/check-products/:id', checkAuth('isAdmin'), manageController.editProductStatus);

module.exports = manageRouter;
