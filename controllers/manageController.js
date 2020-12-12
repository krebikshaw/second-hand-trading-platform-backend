const db = require('../models');
const { Faq, Faq_categories, Rule, Mail, Product } = db;

// these constants declare standard response message
const successMessage = {
  ok: 1,
  message: 'success',
};
const emptyErrorMessage = {
  ok: 0,
  message: 'necessary data cannot be empty',
};
const noDataMessage = {
  ok: 0,
  message: 'No Data.',
};

const manageController = {
  getAllRules: (_, res) => {
    Rule.findAll()
      .then((rules) => {
        const rulesData = {
          ok: 1,
          data: rules.map((ruleData) => {
            const { id, rule, content } = ruleData;
            return { id, rule, content };
          }),
        };
        return res.status(200).json(rulesData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(noDataMessage);
      });
  },

  getRule: (req, res) => {
    Rule.findByPk(req.params.id)
      .then((ruleData) => {
        const { id, rule, content } = ruleData;
        return res.status(200).json({
          ok: 1,
          data: { id, rule, content },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(noDataMessage);
      });
  },

  addRule: (req, res) => {
    const { rule, content } = req.body;
    if (!rule || !content || rule.trim() === '' || content.trim() === '')
      return res.status(400).json(emptyErrorMessage);

    Rule.create({ rule, content })
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        console.log(err);
        res.status(400).json({ ok: 0, message: err });
      });
  },

  editRule: async (req, res) => {
    const { rule, content } = req.body;
    if (!rule || !content || rule.trim() === '' || content.trim() === '')
      return res.status(400).json(emptyErrorMessage);

    const ruleData = await Rule.findByPk(req.params.id).then((rule) => rule);
    if (ruleData === null) return res.status(400).json(noDataMessage);

    ruleData
      .update({ rule, content })
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        console.log(err);
        res.status(400).json({ ok: 0, message: err });
      });
  },

  deleteRule: async (req, res) => {
    const ruleData = await Rule.findByPk(req.params.id).then((rule) => rule);
    if (!req.params.id) return res.status(400).json(noDataMessage);
    if (ruleData === null) return res.status(400).json(noDataMessage);
    ruleData
      .destroy()
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        console.log(err);
        res.status(400).json({ ok: 0, message: err });
      });
  },

  getAllFaqs: (_, res) => {
    Faq.findAll({
      include: Faq_categories,
    })
      .then((faqs) => {
        const faqsData = {
          ok: 1,
          data: faqs.map((faq) => {
            const { id, question, answer } = faq;
            const category = faq.Faq_category.name;
            return { id, category, question, answer };
          }),
        };
        return res.status(200).json(faqsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ ok: 0, message: err });
      });
  },

  getFaq: (req, res) => {
    Faq.findOne({
      where: {
        id: req.params.id,
      },
      include: Faq_categories,
    })
      .then((faq) => {
        const { id, question, answer } = faq;
        const category = faq.Faq_category.name;
        return res.status(200).json({
          ok: 1,
          data: { id, category, question, answer },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(noDataMessage);
      });
  },

  addFaq: async (req, res) => {
    const { question, answer, faqCategoryId } = req.body;
    if (
      !question ||
      !answer ||
      !faqCategoryId ||
      question.trim() === '' ||
      answer.trim() === ''
    )
      return res.status(400).json(emptyErrorMessage);

    const isCategoryValid = await Faq_categories.findByPk(
      faqCategoryId
    ).then((faqCategory) => (faqCategory !== null ? true : false));

    if (!isCategoryValid)
      return res.status(400).json({ ok: 0, message: 'Invalid category.' });

    Faq.create({ question, answer, faqCategoryId })
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        res.status(400).json({ ok: 0, message: err });
      });
  },

  editFaq: async (req, res) => {
    const { question, answer, faqCategoryId } = req.body;
    const faqData = await Faq.findByPk(req.params.id).then(
      (faqData) => faqData
    );
    if (
      !question ||
      !answer ||
      !faqCategoryId ||
      question.trim() === '' ||
      answer.trim() === ''
    )
      return res.status(400).json(emptyErrorMessage);

    if (faqData === null) return res.status(400).json(noDataMessage);
    faqData
      .update({ question, answer, faqCategoryId })
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        res.status(400).json({ ok: 0, message: err });
      });
  },

  deleteFaq: async (req, res) => {
    const faqData = await Faq.findByPk(req.params.id).then((faq) => faq);
    if (faqData === null) return res.status(400).json(noDataMessage);
    faqData
      .destroy()
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        res.status(400).json({ ok: 0, message: err });
      });
  },

  getAllFaqCategories: (_, res) => {
    Faq_categories.findAll()
      .then((faqCategories) => {
        const faqCategoriesData = {
          ok: 1,
          data: faqCategories.map((faqCategories) => {
            const { id, name } = faqCategories;
            return { id, name };
          }),
        };
        return res.status(200).json(faqCategoriesData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(noDataMessage);
      });
  },

  addFaqCategory: (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === '')
      return res.status(400).json(emptyErrorMessage);

    Faq_categories.create({ name })
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        res.status(400).json({ ok: 0, message: err });
      });
  },

  editFaqCategory: async (req, res) => {
    const { name } = req.body;
    const faqCategoryData = await Faq_categories.findByPk(req.params.id).then(
      (faqCategory) => faqCategory
    );
    if (!name || name.trim() === '')
      return res.status(400).json(emptyErrorMessage);
    if (!faqCategoryData) return res.status(400).json(noDataMessage);
    faqCategoryData
      .update({ name })
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        res.status(400).json({ ok: 0, message: err });
      });
  },

  deleteFaqCategory: async (req, res) => {
    const faqCategoryData = await Faq_categories.findOne({
      where: {
        id: req.params.id,
      },
      include: Faq,
    }).then((faqCategory) => faqCategory);
    if (!faqCategoryData) return res.status(400).json(noDataMessage);
    if (faqCategoryData.Faqs[0])
      return res.status(400).json({ ok: 0, message: 'Category not empty.' });
    faqCategoryData
      .destroy()
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        res.status(400).json({ ok: 0, message: err });
      });
  },

  getAllMails: (_, res) => {
    Mail.findAll()
      .then((mails) => {
        const mailsData = {
          ok: 1,
          data: mails.map((mailData) => {
            const { id, name, phone, email, content } = mailData;
            return { id, name, phone, email, content };
          }),
        };
        return res.status(200).json(mailsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ ok: 0, message: err });
      });
  },

  getMail: (req, res) => {
    Mail.findByPk(req.params.id)
      .then((mail) => {
        const { id, name, email, phone, content } = mail;
        return res.status(200).json({
          ok: 1,
          data: { id, name, email, phone, content },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(noDataMessage);
      });
  },

  addMail: (req, res) => {
    const { name, email, phone, content } = req.body;
    console.log(name, email, phone, content);
    if (
      !name ||
      !email ||
      !content ||
      name.trim() === '' ||
      email.trim() === '' ||
      content.trim() === ''
    )
      return res.status(400).json(emptyErrorMessage);
    Mail.create({
      name,
      email,
      phone,
      content,
    })
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        console.log(err);
        res.status(400).json({ ok: 0, message: err });
      });
  },

  editProductStatus: async (req, res) => {
    const { status } = req.body;
    const product = await Product.findByPk(req.params.id).then(
      (product) => product
    );
    if (!status) return res.status(400).json(emptyErrorMessage);
    if (product === null) return res.status(400).json(noDataMessage);
    product
      .update({ status })
      .then(() => res.status(200).json(successMessage))
      .catch((err) => {
        res.status(400).json({ ok: 0, message: err });
      });
  },
};

module.exports = manageController;
