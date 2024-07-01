import express from 'express';
import axios from 'axios';
// import { ensureAuthenticated } from '../services/auth.js';

const router = express.Router();

router.get('/pages', async (req, res) => {
  try {
    const { accessToken } = req.user;
    const response = await axios.get(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
    copnsole.log(response, "nnnn")
    res.json(response.data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/page/insights', async (req, res) => {
  try {
    const { accessToken } = req.user;
    const { pageId, since, until } = req.query;
    const metrics = ['page_fans', 'page_engaged_users', 'page_impressions', 'page_actions_post_reactions_total'];

    const requests = metrics.map(metric =>
      axios.get(`https://graph.facebook.com/${pageId}/insights?metric=${metric}&since=${since}&until=${until}&access_token=${accessToken}`)
    );

    const results = await Promise.all(requests);

    const insights = results.map(result => ({
      metric: result.data.data[0].title,
      value: result.data.data[0].values.reduce((acc, val) => acc + val.value, 0)
    }));

    res.json(insights);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
