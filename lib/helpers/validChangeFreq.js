module.exports = desiredChangeFreq => {
  const acceptedChangeFreqs = [
    'always',
    'hourly',
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'never',
  ];
  if (acceptedChangeFreqs.indexOf(desiredChangeFreq) === -1) {
    // eslint-disable-next-line
    console.warn('Desired change frequency is not a valid type. Ignoring.');
    return '';
  }
  return desiredChangeFreq;
};
