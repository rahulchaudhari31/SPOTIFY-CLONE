const urls = [
"https://youtu.be/maNMfH1dVR0?si=c5QMlPiPD6YTAd_N",
"https://youtu.be/slM5s55Jz0k?si=z6FfeA2tOjq2WOGV",
"https://youtu.be/VNs_cCtdbPc?si=3Fl2l9qgfLDfihJA",
"https://youtu.be/6piRLp7BV8o?si=3_JNCBxyFQi9U_l7",
"https://youtu.be/nqUN530Rgtw?si=rWfpyenCjambao5b",
"https://youtu.be/-YlmnPh-6rE?si=LaybOb2XqA-ISgin",
"https://youtu.be/cl0a3i2wFcc?si=4WwZuVL1sdmXou65",
"https://youtu.be/IltsOcCj1Ak?si=IioqB3wXT4oufA6Q",
"https://youtu.be/FfOwqhckUH8?si=RYEKTto_AlRyVRI0",
"https://youtu.be/ZUR5E18dvrA?si=5W1xGfQMgdIcIzcc",
"https://youtu.be/3ONzh3tf884?si=g7ufxU5_mNVmW_uS",
"https://youtu.be/fG70qm6usR8?si=Rflp9dT4cXkW8l9_",
"https://youtu.be/6RrEQJNZwPQ?si=-OZgSv-NQGV5Z08C",
"https://youtu.be/RVh647FkPtA?si=Z4Sf9z8UuuADvZDw",
"https://youtu.be/6BYIKEH0RCQ?si=U1gSYwxpZg32UXgE",
"https://youtu.be/TVbI55pDdaI?si=4ceN1EoljBgJhvII",
"https://youtu.be/8nGFWWJLHio?si=4b3othX3nVDBtUPq",
"https://youtu.be/jADTdg-o8i0?si=6hfLZdqxTffO_K1l",
"https://youtu.be/vX2cDW8LUWk?si=1Jp3xk51f3dctwe2",
"https://youtu.be/0pWsCiBvLOk?si=pYuLGMWXEpRNP8Pu",
"https://youtu.be/cWMxCE2HTag?si=8ohpi2cUkXtEuz38",
"https://youtu.be/YsCeMprm2O0?si=UtXeby0uLqMYXLo6",
"https://youtu.be/IAvw60x0Kn4?si=wlS276--snZzv6xu",
"https://youtu.be/pGuc4hPhiKw?si=5VUoOcomlsNE1kID",
"https://youtu.be/BWczaSneA0Q?si=LVH0Bmapc5ifZZG_",
"https://youtu.be/2FhgKp_lfJQ?si=iRwQfDdF1PZBPwi8",
"https://youtu.be/5GCfYLguTIs?si=7fx7cDk7hAackdj0",
"https://youtu.be/3KXZduvOfDo?si=OrfGKTcv1aAWAmYG",
"https://youtu.be/mGbkArS9Eyo?si=P96QTz8Ec-IC3alN",
"https://youtu.be/CqDRlVWpzk8?si=p4UaS5dbkva2CYFQ",
"https://youtu.be/bZxtKxiA2qo?si=f12UhUkxGyNzK0c1",
"https://youtu.be/AsEd5OAys9E?si=8JnpJKFj4Fy9cL8N",
"https://youtu.be/hjWf8A0YNSE?si=QfOsqo9zi1ns6vbp",
"https://youtu.be/sxUh-Mq1t6Q?si=aDSYAQxGv_CFYL5e",
"https://youtu.be/cfBLtdg5lYY?si=LWNvDPi2twxF_6Wo",
"https://youtu.be/Mz2yP0A3t4o?si=4FwueaLpJu7HJCzd",
"https://youtu.be/IAvw60x0Kn4?si=xuBUgx4tNN0bxpyD",
"https://youtu.be/4DfVxVeqk2o?si=Uub-zFIJw5BUnVYZ",
"https://youtu.be/cl0a3i2wFcc?si=UJPCDyHywehNyjaq",
"https://youtu.be/N2-HsIYd0Go?si=4nI7FfZo21oSUJiM",
"https://youtu.be/WJP1HWB21EI?si=kpqfjDyL-FCY-S68",
"https://youtu.be/E_SbwSe15y0?si=MP109gtvB2jNc6tl",
"https://youtu.be/mpjNh-uGBY4?si=LnuPn5ANmJyArYAP",
"https://youtu.be/PRXIG7ZWnG8?si=d9trX889W7XVJENY",
"https://youtu.be/oMesPehN_Do?si=k3xMWPTkW34dSG_T"
];

const videoIds = urls.map(url => {
  const match = url.match(/youtu\.be\/([^?]+)/);
  return match ? match[1] : null;
}).filter(Boolean);

console.log(videoIds.join(','));