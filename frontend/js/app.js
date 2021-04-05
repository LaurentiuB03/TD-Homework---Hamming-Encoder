var app = new Vue({
  el: "#hamming-encoder",
  data: {
    dataBits: [],
    status: "",
    numberOfDataBits: 4,
  },
  created: function () {
    this.initDataBits(4);
  },
  methods: {
    initDataBits: function () {
      this.dataBits = [];
      for (var i = 0; i < this.numberOfDataBits; i++) {
        var bit = { data: null };
        this.dataBits.push(bit);
      }
    },
    send: function () {
      if (this.validate(this.dataBits) === true) {
        var encodedMessage = this.encode(this.dataBits);
        // this.status = encodedMessage + ' encoded sent to server ';
        console.log(encodedMessage, this.dataBits);
        return axios
          .put("http://localhost:3000/message", { bits: encodedMessage })
          .then((response) => (this.status = response.data));
      }
    },

    encode: function (bits) {
      // This function must be changed to allow any
      // number of data bits
      // Right now it only works for 4 data bits
      var bitsArray = [];
      for(var i=0; i < bits.length; i++)
      {
             bitsArray[i] = parseInt(bits[i].data);
      }
      var c = [];
      var i=1, j=0;
      while (bits.length / i >= 1)
      {
        c[j]=0;
        j++;
        i *= 2;
      }

      
      bitsArray = c.slice(0,2).concat(bitsArray); // bitsArray is now [c1, c2, a3, a5, a6, a7] or [c1,c2,a3,a5,a6,a7,a9,a10,a11,a12]
      var temp = bitsArray.slice(0,3); //we take [c1, c2, a3]
      temp.push(c[2]); // push c4, so now we have [c1, c2, a3, c4]
      bitsArray = temp.concat(bitsArray.slice(3,bitsArray.length)); 
      // now bitsArray contains the control bits c1, c2 and c4, if the number of data bits is 4, we have all the control bits 
      // so the array looks like [c1 c2 a3 c4 a5 a6 a7] or [c1 c2 a3 c4 a5 a6 a7 a9 a10 a11 a12]
      if (bits.length == 8) //testing the 8 bits case
      {
        temp = bitsArray.slice(0,7);
        temp.push(c[3]);
        bitsArray = temp.concat(bitsArray.slice(7,bitsArray.length)); // now bitsArray contains all the control bits c1, c2 ,c4, c8
      }
      i=1;
      // c1 c2 a3 c4 a5 a6 a7 c8 a9 a10 a11 a12
      
      var controlBit;
      while(i <= bits.length )
      {
        controlBit = 0;
        for (j=i; j<bitsArray.length; j = j+i*2)
        {
          for(var k=0; k<i; k++)
            {
              controlBit += bitsArray[j-1+k];
            }
          }
          
        bitsArray[i-1] = this.parity(controlBit);
        i *= 2;
      }
      
      
      
      return [ bitsArray
      ];
    },
    parity: function (number) {
      return number % 2;
    },
    validate: function (bits) {
      for (var i = 0; i < bits.length; i++) {
        if (this.validateBit(bits[i].data) === false) return false;
      }
      return true;
    },
    validateBit: function (character) {
      if (character === null) return false;
      return parseInt(character) === 0 || parseInt(character) === 1;
    },
  },
});
