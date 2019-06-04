class CookieControl{
    constructor(){
        this.tokenArr=[];
    }
    getToken(){
        var token='';
        var str='fa6f4164afEFfafagagh';
        for (var i = 0; i < 16; i++) {
            if(i % 5 == 0 && i != 0){
                token += '-'
            }
            token += str[parseInt(Math.random() * str.length)]
        }
        this.tokenArr.push(token);
        return token
    }
    checkToken(e){
        for(var i=0;i<this.tokenArr.length;i++){
            if(this.tokenArr[i]==e){
                return true
            }
            return false
        }

    }
    removeToken(){
        this.tokenArr=[]
    }

}
module.exports = CookieControl