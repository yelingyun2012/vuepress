---
sidebar: auto
---

# Numeral.js

**文档地址**
- [numeraljs](http://numeraljs.com/)
- [Math](https://yanhaijing.com/es5/#null)

## 用于格式化字符与处理数字运算
- 主要解决数值格式化、字符格式化
- 四则运算与四舍五入转换二进制计算导致的精度丢失
- toFixed 导致的精度丢失
- 正负数导致的计算与显示异常

## 四则运算
解决浮动运算问题，避免小数点后产生多位数和计算精度损失。

问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998

涉及基础：`parseFloat`、`parseInt`、`Math.pow()`、`toPrecision`、`toFixed`、`split`、 `toString`、`replace`、`Math对象`、精度计算异常原因

```js
/**
 * 把错误的数据转正
 * strip(0.09999999999999998)=0.1
 */
function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision))
}

/**
 * Return digits length of a number
 * @param {*number} num Input number
 */
function digitLength(num) {
  // Get digit length of e
  const eSplit = num.toString().split(/[eE]/)
  const len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0)
  return len > 0 ? len : 0
}

/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {*number} num 输入数
 */
function float2Fixed(num) {
  if (num.toString().indexOf('e') === -1) {
    return Number(num.toString().replace('.', ''))
  }

  const dLen = digitLength(num)
  return dLen > 0 ? strip(num * Math.pow(10, dLen)) : num
}

/**
 * 精确加法
 */
function add(num1, num2, ...others) {
  if (others.length > 0) {
    return add(add(num1, num2), others[0], ...others.slice(1))
  }

  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)))
  return (multiply(num1, baseNum) + multiply(num2, baseNum)) / baseNum
}

/**
 * 精确减法
 */
function subtract(num1, num2, ...others) {
  if (others.length > 0) {
    return subtract(subtract(num1, num2), others[0], ...others.slice(1))
  }

  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)))
  return (multiply(num1, baseNum) - multiply(num2, baseNum)) / baseNum
}

/**
 * 精确乘法
 */
function multiply(num1, num2, ...others) {
  if (others.length > 0) {
    return multiply(multiply(num1, num2), others[0], ...others.slice(1))
  }

  const num1Changed = float2Fixed(num1)
  const num2Changed = float2Fixed(num2)
  const baseNum = digitLength(num1) + digitLength(num2)
  const leftValue = num1Changed * num2Changed

  return leftValue / Math.pow(10, baseNum)
}

/**
 * 精确除法
 */
function divide(num1, num2, ...others) {
  if (others.length > 0) {
    return divide(divide(num1, num2), others[0], ...others.slice(1))
  }

  const num1Changed = float2Fixed(num1)
  const num2Changed = float2Fixed(num2)
  
  // fix: 类似 10 ** -4 为 0.00009999999999999999，strip 修正
  return multiply(num1Changed / num2Changed, strip(Math.pow(10, digitLength(num2) - digitLength(num1))))
}

/**
 * 四舍五入
 */
function round(num, ratio) {
  const base = num < 0 ? -Math.pow(10, ratio) : Math.pow(10, ratio)
  return divide(Math.round(multiply(num, base)), base)
}

```

## numeral.js 自定义扩展方法

vue 项目中建立 numeral.js 扩展文件，注册进 main.js 中， 注册后可全局调用

```js
import numeral from 'numeral'
numeral.register('format', 'percentageNumber', {
  regexps: {
    format: /(&)/,
    unformat: /(&)/
  },
  format: function(value, format, roundingFunction) {
    var space = numeral._.includes(format, ' &') ? ' ' : '',
      output

    var precision = format.split('.')[1]
    var ratio = 3
    var base = value < 0 ? -Math.pow(10, ratio) : Math.pow(10, ratio)

    value = numeral(Math.round(numeral(value).multiply(base).value())).divide(base).value()
    value = numeral(value).multiply(100).value()

    // check for space before %
    format = format.replace(/\s?&/, '')

    output = numeral._.numberToFormat(value, format, roundingFunction)

    if (numeral._.includes(output, ')')) {
      output = output.split('')

      output.splice(-1, 0, space + '%')

      output = output.join('')
    } else {
      output = output + space + '%'
    }

    return output
  },
  unformat: function(string) {
    return numeral._.stringToNumber(string) * 0.01
  }
})

```