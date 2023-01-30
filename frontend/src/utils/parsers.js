

export const parseNumber = (number) => {
        if (number / 10 >= 1){
            return number
        }else{
            return "0" + number
        }
    }