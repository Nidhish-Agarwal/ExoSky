const User = require('../models/User');

exports.completeOnboarding = async (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ message: 'Answers are required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save onboarding answers and mark onboarding as complete
    user.onboardingCompleted = true;
    user.onboardingData = answers;

    await user.save();

    return res.status(200).json({ 
      message: 'Onboarding completed successfully', 
      onboardingCompleted: user.onboardingCompleted,
      onboardingData: user.onboardingData
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
