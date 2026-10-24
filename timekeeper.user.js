// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.0.24
// @description  Enhanced timestamp tool for YouTube videos with DVR/rewind enablement for live streams
// @author       Silent Shout
// @match        https://www.youtube.com/*
// @run-at       document-start
// @noframes
// @icon         https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      *
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issues
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @license MIT
// ==/UserScript==

(()=>{var au=Object.defineProperty;var rs=(t,e)=>{for(var n in e)au(t,n,{get:e[n],enumerable:!0})};var q={};rs(q,{BRAND:()=>Du,DIRTY:()=>Hn,EMPTY_PATH:()=>uu,INVALID:()=>H,NEVER:()=>gd,OK:()=>Ze,ParseStatus:()=>Ue,Schema:()=>J,ZodAny:()=>kn,ZodArray:()=>on,ZodBigInt:()=>Fn,ZodBoolean:()=>jn,ZodBranded:()=>eo,ZodCatch:()=>Qn,ZodDate:()=>Vn,ZodDefault:()=>Xn,ZodDiscriminatedUnion:()=>Ko,ZodEffects:()=>xt,ZodEnum:()=>Kn,ZodError:()=>st,ZodFirstPartyTypeKind:()=>$,ZodFunction:()=>Xo,ZodIntersection:()=>Zn,ZodIssueCode:()=>E,ZodLazy:()=>Wn,ZodLiteral:()=>Yn,ZodMap:()=>_r,ZodNaN:()=>Mr,ZodNativeEnum:()=>Jn,ZodNever:()=>Bt,ZodNull:()=>Gn,ZodNullable:()=>jt,ZodNumber:()=>$n,ZodObject:()=>lt,ZodOptional:()=>bt,ZodParsedType:()=>L,ZodPipeline:()=>to,ZodPromise:()=>Tn,ZodReadonly:()=>er,ZodRecord:()=>Jo,ZodSchema:()=>J,ZodSet:()=>Ar,ZodString:()=>xn,ZodSymbol:()=>Sr,ZodTransformer:()=>xt,ZodTuple:()=>Ft,ZodType:()=>J,ZodUndefined:()=>Un,ZodUnion:()=>qn,ZodUnknown:()=>rn,ZodVoid:()=>Er,addIssueToContext:()=>M,any:()=>Fu,array:()=>Gu,bigint:()=>Ou,boolean:()=>fs,coerce:()=>hd,custom:()=>ds,date:()=>Nu,datetimeRegex:()=>cs,defaultErrorMap:()=>tn,discriminatedUnion:()=>Yu,effect:()=>sd,enum:()=>od,function:()=>td,getErrorMap:()=>xr,getParsedType:()=>$t,instanceof:()=>Ru,intersection:()=>Ku,isAborted:()=>Wo,isAsync:()=>kr,isDirty:()=>Yo,isValid:()=>wn,late:()=>Bu,lazy:()=>nd,literal:()=>rd,makeIssue:()=>Qr,map:()=>Qu,nan:()=>Pu,nativeEnum:()=>id,never:()=>Vu,null:()=>$u,nullable:()=>cd,number:()=>ms,object:()=>qu,objectUtil:()=>Ci,oboolean:()=>fd,onumber:()=>md,optional:()=>ld,ostring:()=>pd,pipeline:()=>dd,preprocess:()=>ud,promise:()=>ad,quotelessJson:()=>su,record:()=>Xu,set:()=>ed,setErrorMap:()=>cu,strictObject:()=>Zu,string:()=>ps,symbol:()=>zu,transformer:()=>sd,tuple:()=>Ju,undefined:()=>Hu,union:()=>Wu,unknown:()=>ju,util:()=>re,void:()=>Uu});var re;(function(t){t.assertEqual=i=>{};function e(i){}t.assertIs=e;function n(i){throw new Error}t.assertNever=n,t.arrayToEnum=i=>{let o={};for(let s of i)o[s]=s;return o},t.getValidEnumValues=i=>{let o=t.objectKeys(i).filter(a=>typeof i[i[a]]!="number"),s={};for(let a of o)s[a]=i[a];return t.objectValues(s)},t.objectValues=i=>t.objectKeys(i).map(function(o){return i[o]}),t.objectKeys=typeof Object.keys=="function"?i=>Object.keys(i):i=>{let o=[];for(let s in i)Object.prototype.hasOwnProperty.call(i,s)&&o.push(s);return o},t.find=(i,o)=>{for(let s of i)if(o(s))return s},t.isInteger=typeof Number.isInteger=="function"?i=>Number.isInteger(i):i=>typeof i=="number"&&Number.isFinite(i)&&Math.floor(i)===i;function r(i,o=" | "){return i.map(s=>typeof s=="string"?`'${s}'`:s).join(o)}t.joinValues=r,t.jsonStringifyReplacer=(i,o)=>typeof o=="bigint"?o.toString():o})(re||(re={}));var Ci;(function(t){t.mergeShapes=(e,n)=>({...e,...n})})(Ci||(Ci={}));var L=re.arrayToEnum(["string","nan","number","integer","float","boolean","date","bigint","symbol","function","undefined","null","array","object","unknown","promise","void","never","map","set"]),$t=t=>{switch(typeof t){case"undefined":return L.undefined;case"string":return L.string;case"number":return Number.isNaN(t)?L.nan:L.number;case"boolean":return L.boolean;case"function":return L.function;case"bigint":return L.bigint;case"symbol":return L.symbol;case"object":return Array.isArray(t)?L.array:t===null?L.null:t.then&&typeof t.then=="function"&&t.catch&&typeof t.catch=="function"?L.promise:typeof Map<"u"&&t instanceof Map?L.map:typeof Set<"u"&&t instanceof Set?L.set:typeof Date<"u"&&t instanceof Date?L.date:L.object;default:return L.unknown}};var E=re.arrayToEnum(["invalid_type","invalid_literal","custom","invalid_union","invalid_union_discriminator","invalid_enum_value","unrecognized_keys","invalid_arguments","invalid_return_type","invalid_date","invalid_string","too_small","too_big","invalid_intersection_types","not_multiple_of","not_finite"]),su=t=>JSON.stringify(t,null,2).replace(/"([^"]+)":/g,"$1:"),st=class t extends Error{get errors(){return this.issues}constructor(e){super(),this.issues=[],this.addIssue=r=>{this.issues=[...this.issues,r]},this.addIssues=(r=[])=>{this.issues=[...this.issues,...r]};let n=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,n):this.__proto__=n,this.name="ZodError",this.issues=e}format(e){let n=e||function(o){return o.message},r={_errors:[]},i=o=>{for(let s of o.issues)if(s.code==="invalid_union")s.unionErrors.map(i);else if(s.code==="invalid_return_type")i(s.returnTypeError);else if(s.code==="invalid_arguments")i(s.argumentsError);else if(s.path.length===0)r._errors.push(n(s));else{let a=r,p=0;for(;p<s.path.length;){let c=s.path[p];p===s.path.length-1?(a[c]=a[c]||{_errors:[]},a[c]._errors.push(n(s))):a[c]=a[c]||{_errors:[]},a=a[c],p++}}};return i(this),r}static assert(e){if(!(e instanceof t))throw new Error(`Not a ZodError: ${e}`)}toString(){return this.message}get message(){return JSON.stringify(this.issues,re.jsonStringifyReplacer,2)}get isEmpty(){return this.issues.length===0}flatten(e=n=>n.message){let n={},r=[];for(let i of this.issues)if(i.path.length>0){let o=i.path[0];n[o]=n[o]||[],n[o].push(e(i))}else r.push(e(i));return{formErrors:r,fieldErrors:n}}get formErrors(){return this.flatten()}};st.create=t=>new st(t);var lu=(t,e)=>{let n;switch(t.code){case E.invalid_type:t.received===L.undefined?n="Required":n=`Expected ${t.expected}, received ${t.received}`;break;case E.invalid_literal:n=`Invalid literal value, expected ${JSON.stringify(t.expected,re.jsonStringifyReplacer)}`;break;case E.unrecognized_keys:n=`Unrecognized key(s) in object: ${re.joinValues(t.keys,", ")}`;break;case E.invalid_union:n="Invalid input";break;case E.invalid_union_discriminator:n=`Invalid discriminator value. Expected ${re.joinValues(t.options)}`;break;case E.invalid_enum_value:n=`Invalid enum value. Expected ${re.joinValues(t.options)}, received '${t.received}'`;break;case E.invalid_arguments:n="Invalid function arguments";break;case E.invalid_return_type:n="Invalid function return type";break;case E.invalid_date:n="Invalid date";break;case E.invalid_string:typeof t.validation=="object"?"includes"in t.validation?(n=`Invalid input: must include "${t.validation.includes}"`,typeof t.validation.position=="number"&&(n=`${n} at one or more positions greater than or equal to ${t.validation.position}`)):"startsWith"in t.validation?n=`Invalid input: must start with "${t.validation.startsWith}"`:"endsWith"in t.validation?n=`Invalid input: must end with "${t.validation.endsWith}"`:re.assertNever(t.validation):t.validation!=="regex"?n=`Invalid ${t.validation}`:n="Invalid";break;case E.too_small:t.type==="array"?n=`Array must contain ${t.exact?"exactly":t.inclusive?"at least":"more than"} ${t.minimum} element(s)`:t.type==="string"?n=`String must contain ${t.exact?"exactly":t.inclusive?"at least":"over"} ${t.minimum} character(s)`:t.type==="number"?n=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${t.minimum}`:t.type==="bigint"?n=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${t.minimum}`:t.type==="date"?n=`Date must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(t.minimum))}`:n="Invalid input";break;case E.too_big:t.type==="array"?n=`Array must contain ${t.exact?"exactly":t.inclusive?"at most":"less than"} ${t.maximum} element(s)`:t.type==="string"?n=`String must contain ${t.exact?"exactly":t.inclusive?"at most":"under"} ${t.maximum} character(s)`:t.type==="number"?n=`Number must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"} ${t.maximum}`:t.type==="bigint"?n=`BigInt must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"} ${t.maximum}`:t.type==="date"?n=`Date must be ${t.exact?"exactly":t.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(t.maximum))}`:n="Invalid input";break;case E.custom:n="Invalid input";break;case E.invalid_intersection_types:n="Intersection results could not be merged";break;case E.not_multiple_of:n=`Number must be a multiple of ${t.multipleOf}`;break;case E.not_finite:n="Number must be finite";break;default:n=e.defaultError,re.assertNever(t)}return{message:n}},tn=lu;var os=tn;function cu(t){os=t}function xr(){return os}var Qr=t=>{let{data:e,path:n,errorMaps:r,issueData:i}=t,o=[...n,...i.path||[]],s={...i,path:o};if(i.message!==void 0)return{...i,path:o,message:i.message};let a="",p=r.filter(c=>!!c).slice().reverse();for(let c of p)a=c(s,{data:e,defaultError:a}).message;return{...i,path:o,message:a}},uu=[];function M(t,e){let n=xr(),r=Qr({issueData:e,data:t.data,path:t.path,errorMaps:[t.common.contextualErrorMap,t.schemaErrorMap,n,n===tn?void 0:tn].filter(i=>!!i)});t.common.issues.push(r)}var Ue=class t{constructor(){this.value="valid"}dirty(){this.value==="valid"&&(this.value="dirty")}abort(){this.value!=="aborted"&&(this.value="aborted")}static mergeArray(e,n){let r=[];for(let i of n){if(i.status==="aborted")return H;i.status==="dirty"&&e.dirty(),r.push(i.value)}return{status:e.value,value:r}}static async mergeObjectAsync(e,n){let r=[];for(let i of n){let o=await i.key,s=await i.value;r.push({key:o,value:s})}return t.mergeObjectSync(e,r)}static mergeObjectSync(e,n){let r={};for(let i of n){let{key:o,value:s}=i;if(o.status==="aborted"||s.status==="aborted")return H;o.status==="dirty"&&e.dirty(),s.status==="dirty"&&e.dirty(),o.value!=="__proto__"&&(typeof s.value<"u"||i.alwaysSet)&&(r[o.value]=s.value)}return{status:e.value,value:r}}},H=Object.freeze({status:"aborted"}),Hn=t=>({status:"dirty",value:t}),Ze=t=>({status:"valid",value:t}),Wo=t=>t.status==="aborted",Yo=t=>t.status==="dirty",wn=t=>t.status==="valid",kr=t=>typeof Promise<"u"&&t instanceof Promise;var P;(function(t){t.errToObj=e=>typeof e=="string"?{message:e}:e||{},t.toString=e=>typeof e=="string"?e:e?.message})(P||(P={}));var wt=class{constructor(e,n,r,i){this._cachedPath=[],this.parent=e,this.data=n,this._path=r,this._key=i}get path(){return this._cachedPath.length||(Array.isArray(this._key)?this._cachedPath.push(...this._path,...this._key):this._cachedPath.push(...this._path,this._key)),this._cachedPath}},is=(t,e)=>{if(wn(e))return{success:!0,data:e.value};if(!t.common.issues.length)throw new Error("Validation failed but no issues detected.");return{success:!1,get error(){if(this._error)return this._error;let n=new st(t.common.issues);return this._error=n,this._error}}};function Y(t){if(!t)return{};let{errorMap:e,invalid_type_error:n,required_error:r,description:i}=t;if(e&&(n||r))throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return e?{errorMap:e,description:i}:{errorMap:(s,a)=>{let{message:p}=t;return s.code==="invalid_enum_value"?{message:p??a.defaultError}:typeof a.data>"u"?{message:p??r??a.defaultError}:s.code!=="invalid_type"?{message:a.defaultError}:{message:p??n??a.defaultError}},description:i}}var J=class{get description(){return this._def.description}_getType(e){return $t(e.data)}_getOrReturnCtx(e,n){return n||{common:e.parent.common,data:e.data,parsedType:$t(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}_processInputParams(e){return{status:new Ue,ctx:{common:e.parent.common,data:e.data,parsedType:$t(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}}_parseSync(e){let n=this._parse(e);if(kr(n))throw new Error("Synchronous parse encountered promise.");return n}_parseAsync(e){let n=this._parse(e);return Promise.resolve(n)}parse(e,n){let r=this.safeParse(e,n);if(r.success)return r.data;throw r.error}safeParse(e,n){let r={common:{issues:[],async:n?.async??!1,contextualErrorMap:n?.errorMap},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:$t(e)},i=this._parseSync({data:e,path:r.path,parent:r});return is(r,i)}"~validate"(e){let n={common:{issues:[],async:!!this["~standard"].async},path:[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:$t(e)};if(!this["~standard"].async)try{let r=this._parseSync({data:e,path:[],parent:n});return wn(r)?{value:r.value}:{issues:n.common.issues}}catch(r){r?.message?.toLowerCase()?.includes("encountered")&&(this["~standard"].async=!0),n.common={issues:[],async:!0}}return this._parseAsync({data:e,path:[],parent:n}).then(r=>wn(r)?{value:r.value}:{issues:n.common.issues})}async parseAsync(e,n){let r=await this.safeParseAsync(e,n);if(r.success)return r.data;throw r.error}async safeParseAsync(e,n){let r={common:{issues:[],contextualErrorMap:n?.errorMap,async:!0},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:$t(e)},i=this._parse({data:e,path:r.path,parent:r}),o=await(kr(i)?i:Promise.resolve(i));return is(r,o)}refine(e,n){let r=i=>typeof n=="string"||typeof n>"u"?{message:n}:typeof n=="function"?n(i):n;return this._refinement((i,o)=>{let s=e(i),a=()=>o.addIssue({code:E.custom,...r(i)});return typeof Promise<"u"&&s instanceof Promise?s.then(p=>p?!0:(a(),!1)):s?!0:(a(),!1)})}refinement(e,n){return this._refinement((r,i)=>e(r)?!0:(i.addIssue(typeof n=="function"?n(r,i):n),!1))}_refinement(e){return new xt({schema:this,typeName:$.ZodEffects,effect:{type:"refinement",refinement:e}})}superRefine(e){return this._refinement(e)}constructor(e){this.spa=this.safeParseAsync,this._def=e,this.parse=this.parse.bind(this),this.safeParse=this.safeParse.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=this.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.superRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.nullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.default.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this),this.readonly=this.readonly.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind(this),this["~standard"]={version:1,vendor:"zod",validate:n=>this["~validate"](n)}}optional(){return bt.create(this,this._def)}nullable(){return jt.create(this,this._def)}nullish(){return this.nullable().optional()}array(){return on.create(this)}promise(){return Tn.create(this,this._def)}or(e){return qn.create([this,e],this._def)}and(e){return Zn.create(this,e,this._def)}transform(e){return new xt({...Y(this._def),schema:this,typeName:$.ZodEffects,effect:{type:"transform",transform:e}})}default(e){let n=typeof e=="function"?e:()=>e;return new Xn({...Y(this._def),innerType:this,defaultValue:n,typeName:$.ZodDefault})}brand(){return new eo({typeName:$.ZodBranded,type:this,...Y(this._def)})}catch(e){let n=typeof e=="function"?e:()=>e;return new Qn({...Y(this._def),innerType:this,catchValue:n,typeName:$.ZodCatch})}describe(e){let n=this.constructor;return new n({...this._def,description:e})}pipe(e){return to.create(this,e)}readonly(){return er.create(this)}isOptional(){return this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}},du=/^c[^\s-]{8,}$/i,pu=/^[0-9a-z]+$/,mu=/^[0-9A-HJKMNP-TV-Z]{26}$/i,fu=/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,hu=/^[a-z0-9_-]{21}$/i,gu=/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,vu=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,yu=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,bu="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",Di,wu=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,xu=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,ku=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,Tu=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Su=/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,Eu=/^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,ss="((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",_u=new RegExp(`^${ss}$`);function ls(t){let e="[0-5]\\d";t.precision?e=`${e}\\.\\d{${t.precision}}`:t.precision==null&&(e=`${e}(\\.\\d+)?`);let n=t.precision?"+":"?";return`([01]\\d|2[0-3]):[0-5]\\d(:${e})${n}`}function Au(t){return new RegExp(`^${ls(t)}$`)}function cs(t){let e=`${ss}T${ls(t)}`,n=[];return n.push(t.local?"Z?":"Z"),t.offset&&n.push("([+-]\\d{2}:?\\d{2})"),e=`${e}(${n.join("|")})`,new RegExp(`^${e}$`)}function Mu(t,e){return!!((e==="v4"||!e)&&wu.test(t)||(e==="v6"||!e)&&ku.test(t))}function Lu(t,e){if(!gu.test(t))return!1;try{let[n]=t.split(".");if(!n)return!1;let r=n.replace(/-/g,"+").replace(/_/g,"/").padEnd(n.length+(4-n.length%4)%4,"="),i=JSON.parse(atob(r));return!(typeof i!="object"||i===null||"typ"in i&&i?.typ!=="JWT"||!i.alg||e&&i.alg!==e)}catch{return!1}}function Iu(t,e){return!!((e==="v4"||!e)&&xu.test(t)||(e==="v6"||!e)&&Tu.test(t))}var xn=class t extends J{_parse(e){if(this._def.coerce&&(e.data=String(e.data)),this._getType(e)!==L.string){let o=this._getOrReturnCtx(e);return M(o,{code:E.invalid_type,expected:L.string,received:o.parsedType}),H}let r=new Ue,i;for(let o of this._def.checks)if(o.kind==="min")e.data.length<o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:E.too_small,minimum:o.value,type:"string",inclusive:!0,exact:!1,message:o.message}),r.dirty());else if(o.kind==="max")e.data.length>o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:E.too_big,maximum:o.value,type:"string",inclusive:!0,exact:!1,message:o.message}),r.dirty());else if(o.kind==="length"){let s=e.data.length>o.value,a=e.data.length<o.value;(s||a)&&(i=this._getOrReturnCtx(e,i),s?M(i,{code:E.too_big,maximum:o.value,type:"string",inclusive:!0,exact:!0,message:o.message}):a&&M(i,{code:E.too_small,minimum:o.value,type:"string",inclusive:!0,exact:!0,message:o.message}),r.dirty())}else if(o.kind==="email")yu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"email",code:E.invalid_string,message:o.message}),r.dirty());else if(o.kind==="emoji")Di||(Di=new RegExp(bu,"u")),Di.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"emoji",code:E.invalid_string,message:o.message}),r.dirty());else if(o.kind==="uuid")fu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"uuid",code:E.invalid_string,message:o.message}),r.dirty());else if(o.kind==="nanoid")hu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"nanoid",code:E.invalid_string,message:o.message}),r.dirty());else if(o.kind==="cuid")du.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"cuid",code:E.invalid_string,message:o.message}),r.dirty());else if(o.kind==="cuid2")pu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"cuid2",code:E.invalid_string,message:o.message}),r.dirty());else if(o.kind==="ulid")mu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"ulid",code:E.invalid_string,message:o.message}),r.dirty());else if(o.kind==="url")try{new URL(e.data)}catch{i=this._getOrReturnCtx(e,i),M(i,{validation:"url",code:E.invalid_string,message:o.message}),r.dirty()}else o.kind==="regex"?(o.regex.lastIndex=0,o.regex.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"regex",code:E.invalid_string,message:o.message}),r.dirty())):o.kind==="trim"?e.data=e.data.trim():o.kind==="includes"?e.data.includes(o.value,o.position)||(i=this._getOrReturnCtx(e,i),M(i,{code:E.invalid_string,validation:{includes:o.value,position:o.position},message:o.message}),r.dirty()):o.kind==="toLowerCase"?e.data=e.data.toLowerCase():o.kind==="toUpperCase"?e.data=e.data.toUpperCase():o.kind==="startsWith"?e.data.startsWith(o.value)||(i=this._getOrReturnCtx(e,i),M(i,{code:E.invalid_string,validation:{startsWith:o.value},message:o.message}),r.dirty()):o.kind==="endsWith"?e.data.endsWith(o.value)||(i=this._getOrReturnCtx(e,i),M(i,{code:E.invalid_string,validation:{endsWith:o.value},message:o.message}),r.dirty()):o.kind==="datetime"?cs(o).test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{code:E.invalid_string,validation:"datetime",message:o.message}),r.dirty()):o.kind==="date"?_u.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{code:E.invalid_string,validation:"date",message:o.message}),r.dirty()):o.kind==="time"?Au(o).test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{code:E.invalid_string,validation:"time",message:o.message}),r.dirty()):o.kind==="duration"?vu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"duration",code:E.invalid_string,message:o.message}),r.dirty()):o.kind==="ip"?Mu(e.data,o.version)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"ip",code:E.invalid_string,message:o.message}),r.dirty()):o.kind==="jwt"?Lu(e.data,o.alg)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"jwt",code:E.invalid_string,message:o.message}),r.dirty()):o.kind==="cidr"?Iu(e.data,o.version)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"cidr",code:E.invalid_string,message:o.message}),r.dirty()):o.kind==="base64"?Su.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"base64",code:E.invalid_string,message:o.message}),r.dirty()):o.kind==="base64url"?Eu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"base64url",code:E.invalid_string,message:o.message}),r.dirty()):re.assertNever(o);return{status:r.value,value:e.data}}_regex(e,n,r){return this.refinement(i=>e.test(i),{validation:n,code:E.invalid_string,...P.errToObj(r)})}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}email(e){return this._addCheck({kind:"email",...P.errToObj(e)})}url(e){return this._addCheck({kind:"url",...P.errToObj(e)})}emoji(e){return this._addCheck({kind:"emoji",...P.errToObj(e)})}uuid(e){return this._addCheck({kind:"uuid",...P.errToObj(e)})}nanoid(e){return this._addCheck({kind:"nanoid",...P.errToObj(e)})}cuid(e){return this._addCheck({kind:"cuid",...P.errToObj(e)})}cuid2(e){return this._addCheck({kind:"cuid2",...P.errToObj(e)})}ulid(e){return this._addCheck({kind:"ulid",...P.errToObj(e)})}base64(e){return this._addCheck({kind:"base64",...P.errToObj(e)})}base64url(e){return this._addCheck({kind:"base64url",...P.errToObj(e)})}jwt(e){return this._addCheck({kind:"jwt",...P.errToObj(e)})}ip(e){return this._addCheck({kind:"ip",...P.errToObj(e)})}cidr(e){return this._addCheck({kind:"cidr",...P.errToObj(e)})}datetime(e){return typeof e=="string"?this._addCheck({kind:"datetime",precision:null,offset:!1,local:!1,message:e}):this._addCheck({kind:"datetime",precision:typeof e?.precision>"u"?null:e?.precision,offset:e?.offset??!1,local:e?.local??!1,...P.errToObj(e?.message)})}date(e){return this._addCheck({kind:"date",message:e})}time(e){return typeof e=="string"?this._addCheck({kind:"time",precision:null,message:e}):this._addCheck({kind:"time",precision:typeof e?.precision>"u"?null:e?.precision,...P.errToObj(e?.message)})}duration(e){return this._addCheck({kind:"duration",...P.errToObj(e)})}regex(e,n){return this._addCheck({kind:"regex",regex:e,...P.errToObj(n)})}includes(e,n){return this._addCheck({kind:"includes",value:e,position:n?.position,...P.errToObj(n?.message)})}startsWith(e,n){return this._addCheck({kind:"startsWith",value:e,...P.errToObj(n)})}endsWith(e,n){return this._addCheck({kind:"endsWith",value:e,...P.errToObj(n)})}min(e,n){return this._addCheck({kind:"min",value:e,...P.errToObj(n)})}max(e,n){return this._addCheck({kind:"max",value:e,...P.errToObj(n)})}length(e,n){return this._addCheck({kind:"length",value:e,...P.errToObj(n)})}nonempty(e){return this.min(1,P.errToObj(e))}trim(){return new t({...this._def,checks:[...this._def.checks,{kind:"trim"}]})}toLowerCase(){return new t({...this._def,checks:[...this._def.checks,{kind:"toLowerCase"}]})}toUpperCase(){return new t({...this._def,checks:[...this._def.checks,{kind:"toUpperCase"}]})}get isDatetime(){return!!this._def.checks.find(e=>e.kind==="datetime")}get isDate(){return!!this._def.checks.find(e=>e.kind==="date")}get isTime(){return!!this._def.checks.find(e=>e.kind==="time")}get isDuration(){return!!this._def.checks.find(e=>e.kind==="duration")}get isEmail(){return!!this._def.checks.find(e=>e.kind==="email")}get isURL(){return!!this._def.checks.find(e=>e.kind==="url")}get isEmoji(){return!!this._def.checks.find(e=>e.kind==="emoji")}get isUUID(){return!!this._def.checks.find(e=>e.kind==="uuid")}get isNANOID(){return!!this._def.checks.find(e=>e.kind==="nanoid")}get isCUID(){return!!this._def.checks.find(e=>e.kind==="cuid")}get isCUID2(){return!!this._def.checks.find(e=>e.kind==="cuid2")}get isULID(){return!!this._def.checks.find(e=>e.kind==="ulid")}get isIP(){return!!this._def.checks.find(e=>e.kind==="ip")}get isCIDR(){return!!this._def.checks.find(e=>e.kind==="cidr")}get isBase64(){return!!this._def.checks.find(e=>e.kind==="base64")}get isBase64url(){return!!this._def.checks.find(e=>e.kind==="base64url")}get minLength(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxLength(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}};xn.create=t=>new xn({checks:[],typeName:$.ZodString,coerce:t?.coerce??!1,...Y(t)});function Cu(t,e){let n=(t.toString().split(".")[1]||"").length,r=(e.toString().split(".")[1]||"").length,i=n>r?n:r,o=Number.parseInt(t.toFixed(i).replace(".","")),s=Number.parseInt(e.toFixed(i).replace(".",""));return o%s/10**i}var $n=class t extends J{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(e){if(this._def.coerce&&(e.data=Number(e.data)),this._getType(e)!==L.number){let o=this._getOrReturnCtx(e);return M(o,{code:E.invalid_type,expected:L.number,received:o.parsedType}),H}let r,i=new Ue;for(let o of this._def.checks)o.kind==="int"?re.isInteger(e.data)||(r=this._getOrReturnCtx(e,r),M(r,{code:E.invalid_type,expected:"integer",received:"float",message:o.message}),i.dirty()):o.kind==="min"?(o.inclusive?e.data<o.value:e.data<=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:E.too_small,minimum:o.value,type:"number",inclusive:o.inclusive,exact:!1,message:o.message}),i.dirty()):o.kind==="max"?(o.inclusive?e.data>o.value:e.data>=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:E.too_big,maximum:o.value,type:"number",inclusive:o.inclusive,exact:!1,message:o.message}),i.dirty()):o.kind==="multipleOf"?Cu(e.data,o.value)!==0&&(r=this._getOrReturnCtx(e,r),M(r,{code:E.not_multiple_of,multipleOf:o.value,message:o.message}),i.dirty()):o.kind==="finite"?Number.isFinite(e.data)||(r=this._getOrReturnCtx(e,r),M(r,{code:E.not_finite,message:o.message}),i.dirty()):re.assertNever(o);return{status:i.value,value:e.data}}gte(e,n){return this.setLimit("min",e,!0,P.toString(n))}gt(e,n){return this.setLimit("min",e,!1,P.toString(n))}lte(e,n){return this.setLimit("max",e,!0,P.toString(n))}lt(e,n){return this.setLimit("max",e,!1,P.toString(n))}setLimit(e,n,r,i){return new t({...this._def,checks:[...this._def.checks,{kind:e,value:n,inclusive:r,message:P.toString(i)}]})}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}int(e){return this._addCheck({kind:"int",message:P.toString(e)})}positive(e){return this._addCheck({kind:"min",value:0,inclusive:!1,message:P.toString(e)})}negative(e){return this._addCheck({kind:"max",value:0,inclusive:!1,message:P.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:0,inclusive:!0,message:P.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:0,inclusive:!0,message:P.toString(e)})}multipleOf(e,n){return this._addCheck({kind:"multipleOf",value:e,message:P.toString(n)})}finite(e){return this._addCheck({kind:"finite",message:P.toString(e)})}safe(e){return this._addCheck({kind:"min",inclusive:!0,value:Number.MIN_SAFE_INTEGER,message:P.toString(e)})._addCheck({kind:"max",inclusive:!0,value:Number.MAX_SAFE_INTEGER,message:P.toString(e)})}get minValue(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxValue(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}get isInt(){return!!this._def.checks.find(e=>e.kind==="int"||e.kind==="multipleOf"&&re.isInteger(e.value))}get isFinite(){let e=null,n=null;for(let r of this._def.checks){if(r.kind==="finite"||r.kind==="int"||r.kind==="multipleOf")return!0;r.kind==="min"?(n===null||r.value>n)&&(n=r.value):r.kind==="max"&&(e===null||r.value<e)&&(e=r.value)}return Number.isFinite(n)&&Number.isFinite(e)}};$n.create=t=>new $n({checks:[],typeName:$.ZodNumber,coerce:t?.coerce||!1,...Y(t)});var Fn=class t extends J{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte}_parse(e){if(this._def.coerce)try{e.data=BigInt(e.data)}catch{return this._getInvalidInput(e)}if(this._getType(e)!==L.bigint)return this._getInvalidInput(e);let r,i=new Ue;for(let o of this._def.checks)o.kind==="min"?(o.inclusive?e.data<o.value:e.data<=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:E.too_small,type:"bigint",minimum:o.value,inclusive:o.inclusive,message:o.message}),i.dirty()):o.kind==="max"?(o.inclusive?e.data>o.value:e.data>=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:E.too_big,type:"bigint",maximum:o.value,inclusive:o.inclusive,message:o.message}),i.dirty()):o.kind==="multipleOf"?e.data%o.value!==BigInt(0)&&(r=this._getOrReturnCtx(e,r),M(r,{code:E.not_multiple_of,multipleOf:o.value,message:o.message}),i.dirty()):re.assertNever(o);return{status:i.value,value:e.data}}_getInvalidInput(e){let n=this._getOrReturnCtx(e);return M(n,{code:E.invalid_type,expected:L.bigint,received:n.parsedType}),H}gte(e,n){return this.setLimit("min",e,!0,P.toString(n))}gt(e,n){return this.setLimit("min",e,!1,P.toString(n))}lte(e,n){return this.setLimit("max",e,!0,P.toString(n))}lt(e,n){return this.setLimit("max",e,!1,P.toString(n))}setLimit(e,n,r,i){return new t({...this._def,checks:[...this._def.checks,{kind:e,value:n,inclusive:r,message:P.toString(i)}]})}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}positive(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!1,message:P.toString(e)})}negative(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!1,message:P.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!0,message:P.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!0,message:P.toString(e)})}multipleOf(e,n){return this._addCheck({kind:"multipleOf",value:e,message:P.toString(n)})}get minValue(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxValue(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}};Fn.create=t=>new Fn({checks:[],typeName:$.ZodBigInt,coerce:t?.coerce??!1,...Y(t)});var jn=class extends J{_parse(e){if(this._def.coerce&&(e.data=!!e.data),this._getType(e)!==L.boolean){let r=this._getOrReturnCtx(e);return M(r,{code:E.invalid_type,expected:L.boolean,received:r.parsedType}),H}return Ze(e.data)}};jn.create=t=>new jn({typeName:$.ZodBoolean,coerce:t?.coerce||!1,...Y(t)});var Vn=class t extends J{_parse(e){if(this._def.coerce&&(e.data=new Date(e.data)),this._getType(e)!==L.date){let o=this._getOrReturnCtx(e);return M(o,{code:E.invalid_type,expected:L.date,received:o.parsedType}),H}if(Number.isNaN(e.data.getTime())){let o=this._getOrReturnCtx(e);return M(o,{code:E.invalid_date}),H}let r=new Ue,i;for(let o of this._def.checks)o.kind==="min"?e.data.getTime()<o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:E.too_small,message:o.message,inclusive:!0,exact:!1,minimum:o.value,type:"date"}),r.dirty()):o.kind==="max"?e.data.getTime()>o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:E.too_big,message:o.message,inclusive:!0,exact:!1,maximum:o.value,type:"date"}),r.dirty()):re.assertNever(o);return{status:r.value,value:new Date(e.data.getTime())}}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}min(e,n){return this._addCheck({kind:"min",value:e.getTime(),message:P.toString(n)})}max(e,n){return this._addCheck({kind:"max",value:e.getTime(),message:P.toString(n)})}get minDate(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e!=null?new Date(e):null}get maxDate(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e!=null?new Date(e):null}};Vn.create=t=>new Vn({checks:[],coerce:t?.coerce||!1,typeName:$.ZodDate,...Y(t)});var Sr=class extends J{_parse(e){if(this._getType(e)!==L.symbol){let r=this._getOrReturnCtx(e);return M(r,{code:E.invalid_type,expected:L.symbol,received:r.parsedType}),H}return Ze(e.data)}};Sr.create=t=>new Sr({typeName:$.ZodSymbol,...Y(t)});var Un=class extends J{_parse(e){if(this._getType(e)!==L.undefined){let r=this._getOrReturnCtx(e);return M(r,{code:E.invalid_type,expected:L.undefined,received:r.parsedType}),H}return Ze(e.data)}};Un.create=t=>new Un({typeName:$.ZodUndefined,...Y(t)});var Gn=class extends J{_parse(e){if(this._getType(e)!==L.null){let r=this._getOrReturnCtx(e);return M(r,{code:E.invalid_type,expected:L.null,received:r.parsedType}),H}return Ze(e.data)}};Gn.create=t=>new Gn({typeName:$.ZodNull,...Y(t)});var kn=class extends J{constructor(){super(...arguments),this._any=!0}_parse(e){return Ze(e.data)}};kn.create=t=>new kn({typeName:$.ZodAny,...Y(t)});var rn=class extends J{constructor(){super(...arguments),this._unknown=!0}_parse(e){return Ze(e.data)}};rn.create=t=>new rn({typeName:$.ZodUnknown,...Y(t)});var Bt=class extends J{_parse(e){let n=this._getOrReturnCtx(e);return M(n,{code:E.invalid_type,expected:L.never,received:n.parsedType}),H}};Bt.create=t=>new Bt({typeName:$.ZodNever,...Y(t)});var Er=class extends J{_parse(e){if(this._getType(e)!==L.undefined){let r=this._getOrReturnCtx(e);return M(r,{code:E.invalid_type,expected:L.void,received:r.parsedType}),H}return Ze(e.data)}};Er.create=t=>new Er({typeName:$.ZodVoid,...Y(t)});var on=class t extends J{_parse(e){let{ctx:n,status:r}=this._processInputParams(e),i=this._def;if(n.parsedType!==L.array)return M(n,{code:E.invalid_type,expected:L.array,received:n.parsedType}),H;if(i.exactLength!==null){let s=n.data.length>i.exactLength.value,a=n.data.length<i.exactLength.value;(s||a)&&(M(n,{code:s?E.too_big:E.too_small,minimum:a?i.exactLength.value:void 0,maximum:s?i.exactLength.value:void 0,type:"array",inclusive:!0,exact:!0,message:i.exactLength.message}),r.dirty())}if(i.minLength!==null&&n.data.length<i.minLength.value&&(M(n,{code:E.too_small,minimum:i.minLength.value,type:"array",inclusive:!0,exact:!1,message:i.minLength.message}),r.dirty()),i.maxLength!==null&&n.data.length>i.maxLength.value&&(M(n,{code:E.too_big,maximum:i.maxLength.value,type:"array",inclusive:!0,exact:!1,message:i.maxLength.message}),r.dirty()),n.common.async)return Promise.all([...n.data].map((s,a)=>i.type._parseAsync(new wt(n,s,n.path,a)))).then(s=>Ue.mergeArray(r,s));let o=[...n.data].map((s,a)=>i.type._parseSync(new wt(n,s,n.path,a)));return Ue.mergeArray(r,o)}get element(){return this._def.type}min(e,n){return new t({...this._def,minLength:{value:e,message:P.toString(n)}})}max(e,n){return new t({...this._def,maxLength:{value:e,message:P.toString(n)}})}length(e,n){return new t({...this._def,exactLength:{value:e,message:P.toString(n)}})}nonempty(e){return this.min(1,e)}};on.create=(t,e)=>new on({type:t,minLength:null,maxLength:null,exactLength:null,typeName:$.ZodArray,...Y(e)});function Tr(t){if(t instanceof lt){let e={};for(let n in t.shape){let r=t.shape[n];e[n]=bt.create(Tr(r))}return new lt({...t._def,shape:()=>e})}else return t instanceof on?new on({...t._def,type:Tr(t.element)}):t instanceof bt?bt.create(Tr(t.unwrap())):t instanceof jt?jt.create(Tr(t.unwrap())):t instanceof Ft?Ft.create(t.items.map(e=>Tr(e))):t}var lt=class t extends J{constructor(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this._cached!==null)return this._cached;let e=this._def.shape(),n=re.objectKeys(e);return this._cached={shape:e,keys:n},this._cached}_parse(e){if(this._getType(e)!==L.object){let c=this._getOrReturnCtx(e);return M(c,{code:E.invalid_type,expected:L.object,received:c.parsedType}),H}let{status:r,ctx:i}=this._processInputParams(e),{shape:o,keys:s}=this._getCached(),a=[];if(!(this._def.catchall instanceof Bt&&this._def.unknownKeys==="strip"))for(let c in i.data)s.includes(c)||a.push(c);let p=[];for(let c of s){let u=o[c],g=i.data[c];p.push({key:{status:"valid",value:c},value:u._parse(new wt(i,g,i.path,c)),alwaysSet:c in i.data})}if(this._def.catchall instanceof Bt){let c=this._def.unknownKeys;if(c==="passthrough")for(let u of a)p.push({key:{status:"valid",value:u},value:{status:"valid",value:i.data[u]}});else if(c==="strict")a.length>0&&(M(i,{code:E.unrecognized_keys,keys:a}),r.dirty());else if(c!=="strip")throw new Error("Internal ZodObject error: invalid unknownKeys value.")}else{let c=this._def.catchall;for(let u of a){let g=i.data[u];p.push({key:{status:"valid",value:u},value:c._parse(new wt(i,g,i.path,u)),alwaysSet:u in i.data})}}return i.common.async?Promise.resolve().then(async()=>{let c=[];for(let u of p){let g=await u.key,y=await u.value;c.push({key:g,value:y,alwaysSet:u.alwaysSet})}return c}).then(c=>Ue.mergeObjectSync(r,c)):Ue.mergeObjectSync(r,p)}get shape(){return this._def.shape()}strict(e){return P.errToObj,new t({...this._def,unknownKeys:"strict",...e!==void 0?{errorMap:(n,r)=>{let i=this._def.errorMap?.(n,r).message??r.defaultError;return n.code==="unrecognized_keys"?{message:P.errToObj(e).message??i}:{message:i}}}:{}})}strip(){return new t({...this._def,unknownKeys:"strip"})}passthrough(){return new t({...this._def,unknownKeys:"passthrough"})}extend(e){return new t({...this._def,shape:()=>({...this._def.shape(),...e})})}merge(e){return new t({unknownKeys:e._def.unknownKeys,catchall:e._def.catchall,shape:()=>({...this._def.shape(),...e._def.shape()}),typeName:$.ZodObject})}setKey(e,n){return this.augment({[e]:n})}catchall(e){return new t({...this._def,catchall:e})}pick(e){let n={};for(let r of re.objectKeys(e))e[r]&&this.shape[r]&&(n[r]=this.shape[r]);return new t({...this._def,shape:()=>n})}omit(e){let n={};for(let r of re.objectKeys(this.shape))e[r]||(n[r]=this.shape[r]);return new t({...this._def,shape:()=>n})}deepPartial(){return Tr(this)}partial(e){let n={};for(let r of re.objectKeys(this.shape)){let i=this.shape[r];e&&!e[r]?n[r]=i:n[r]=i.optional()}return new t({...this._def,shape:()=>n})}required(e){let n={};for(let r of re.objectKeys(this.shape))if(e&&!e[r])n[r]=this.shape[r];else{let o=this.shape[r];for(;o instanceof bt;)o=o._def.innerType;n[r]=o}return new t({...this._def,shape:()=>n})}keyof(){return us(re.objectKeys(this.shape))}};lt.create=(t,e)=>new lt({shape:()=>t,unknownKeys:"strip",catchall:Bt.create(),typeName:$.ZodObject,...Y(e)});lt.strictCreate=(t,e)=>new lt({shape:()=>t,unknownKeys:"strict",catchall:Bt.create(),typeName:$.ZodObject,...Y(e)});lt.lazycreate=(t,e)=>new lt({shape:t,unknownKeys:"strip",catchall:Bt.create(),typeName:$.ZodObject,...Y(e)});var qn=class extends J{_parse(e){let{ctx:n}=this._processInputParams(e),r=this._def.options;function i(o){for(let a of o)if(a.result.status==="valid")return a.result;for(let a of o)if(a.result.status==="dirty")return n.common.issues.push(...a.ctx.common.issues),a.result;let s=o.map(a=>new st(a.ctx.common.issues));return M(n,{code:E.invalid_union,unionErrors:s}),H}if(n.common.async)return Promise.all(r.map(async o=>{let s={...n,common:{...n.common,issues:[]},parent:null};return{result:await o._parseAsync({data:n.data,path:n.path,parent:s}),ctx:s}})).then(i);{let o,s=[];for(let p of r){let c={...n,common:{...n.common,issues:[]},parent:null},u=p._parseSync({data:n.data,path:n.path,parent:c});if(u.status==="valid")return u;u.status==="dirty"&&!o&&(o={result:u,ctx:c}),c.common.issues.length&&s.push(c.common.issues)}if(o)return n.common.issues.push(...o.ctx.common.issues),o.result;let a=s.map(p=>new st(p));return M(n,{code:E.invalid_union,unionErrors:a}),H}}get options(){return this._def.options}};qn.create=(t,e)=>new qn({options:t,typeName:$.ZodUnion,...Y(e)});var nn=t=>t instanceof Wn?nn(t.schema):t instanceof xt?nn(t.innerType()):t instanceof Yn?[t.value]:t instanceof Kn?t.options:t instanceof Jn?re.objectValues(t.enum):t instanceof Xn?nn(t._def.innerType):t instanceof Un?[void 0]:t instanceof Gn?[null]:t instanceof bt?[void 0,...nn(t.unwrap())]:t instanceof jt?[null,...nn(t.unwrap())]:t instanceof eo||t instanceof er?nn(t.unwrap()):t instanceof Qn?nn(t._def.innerType):[],Ko=class t extends J{_parse(e){let{ctx:n}=this._processInputParams(e);if(n.parsedType!==L.object)return M(n,{code:E.invalid_type,expected:L.object,received:n.parsedType}),H;let r=this.discriminator,i=n.data[r],o=this.optionsMap.get(i);return o?n.common.async?o._parseAsync({data:n.data,path:n.path,parent:n}):o._parseSync({data:n.data,path:n.path,parent:n}):(M(n,{code:E.invalid_union_discriminator,options:Array.from(this.optionsMap.keys()),path:[r]}),H)}get discriminator(){return this._def.discriminator}get options(){return this._def.options}get optionsMap(){return this._def.optionsMap}static create(e,n,r){let i=new Map;for(let o of n){let s=nn(o.shape[e]);if(!s.length)throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);for(let a of s){if(i.has(a))throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(a)}`);i.set(a,o)}}return new t({typeName:$.ZodDiscriminatedUnion,discriminator:e,options:n,optionsMap:i,...Y(r)})}};function Bi(t,e){let n=$t(t),r=$t(e);if(t===e)return{valid:!0,data:t};if(n===L.object&&r===L.object){let i=re.objectKeys(e),o=re.objectKeys(t).filter(a=>i.indexOf(a)!==-1),s={...t,...e};for(let a of o){let p=Bi(t[a],e[a]);if(!p.valid)return{valid:!1};s[a]=p.data}return{valid:!0,data:s}}else if(n===L.array&&r===L.array){if(t.length!==e.length)return{valid:!1};let i=[];for(let o=0;o<t.length;o++){let s=t[o],a=e[o],p=Bi(s,a);if(!p.valid)return{valid:!1};i.push(p.data)}return{valid:!0,data:i}}else return n===L.date&&r===L.date&&+t==+e?{valid:!0,data:t}:{valid:!1}}var Zn=class extends J{_parse(e){let{status:n,ctx:r}=this._processInputParams(e),i=(o,s)=>{if(Wo(o)||Wo(s))return H;let a=Bi(o.value,s.value);return a.valid?((Yo(o)||Yo(s))&&n.dirty(),{status:n.value,value:a.data}):(M(r,{code:E.invalid_intersection_types}),H)};return r.common.async?Promise.all([this._def.left._parseAsync({data:r.data,path:r.path,parent:r}),this._def.right._parseAsync({data:r.data,path:r.path,parent:r})]).then(([o,s])=>i(o,s)):i(this._def.left._parseSync({data:r.data,path:r.path,parent:r}),this._def.right._parseSync({data:r.data,path:r.path,parent:r}))}};Zn.create=(t,e,n)=>new Zn({left:t,right:e,typeName:$.ZodIntersection,...Y(n)});var Ft=class t extends J{_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==L.array)return M(r,{code:E.invalid_type,expected:L.array,received:r.parsedType}),H;if(r.data.length<this._def.items.length)return M(r,{code:E.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),H;!this._def.rest&&r.data.length>this._def.items.length&&(M(r,{code:E.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),n.dirty());let o=[...r.data].map((s,a)=>{let p=this._def.items[a]||this._def.rest;return p?p._parse(new wt(r,s,r.path,a)):null}).filter(s=>!!s);return r.common.async?Promise.all(o).then(s=>Ue.mergeArray(n,s)):Ue.mergeArray(n,o)}get items(){return this._def.items}rest(e){return new t({...this._def,rest:e})}};Ft.create=(t,e)=>{if(!Array.isArray(t))throw new Error("You must pass an array of schemas to z.tuple([ ... ])");return new Ft({items:t,typeName:$.ZodTuple,rest:null,...Y(e)})};var Jo=class t extends J{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==L.object)return M(r,{code:E.invalid_type,expected:L.object,received:r.parsedType}),H;let i=[],o=this._def.keyType,s=this._def.valueType;for(let a in r.data)i.push({key:o._parse(new wt(r,a,r.path,a)),value:s._parse(new wt(r,r.data[a],r.path,a)),alwaysSet:a in r.data});return r.common.async?Ue.mergeObjectAsync(n,i):Ue.mergeObjectSync(n,i)}get element(){return this._def.valueType}static create(e,n,r){return n instanceof J?new t({keyType:e,valueType:n,typeName:$.ZodRecord,...Y(r)}):new t({keyType:xn.create(),valueType:e,typeName:$.ZodRecord,...Y(n)})}},_r=class extends J{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==L.map)return M(r,{code:E.invalid_type,expected:L.map,received:r.parsedType}),H;let i=this._def.keyType,o=this._def.valueType,s=[...r.data.entries()].map(([a,p],c)=>({key:i._parse(new wt(r,a,r.path,[c,"key"])),value:o._parse(new wt(r,p,r.path,[c,"value"]))}));if(r.common.async){let a=new Map;return Promise.resolve().then(async()=>{for(let p of s){let c=await p.key,u=await p.value;if(c.status==="aborted"||u.status==="aborted")return H;(c.status==="dirty"||u.status==="dirty")&&n.dirty(),a.set(c.value,u.value)}return{status:n.value,value:a}})}else{let a=new Map;for(let p of s){let c=p.key,u=p.value;if(c.status==="aborted"||u.status==="aborted")return H;(c.status==="dirty"||u.status==="dirty")&&n.dirty(),a.set(c.value,u.value)}return{status:n.value,value:a}}}};_r.create=(t,e,n)=>new _r({valueType:e,keyType:t,typeName:$.ZodMap,...Y(n)});var Ar=class t extends J{_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==L.set)return M(r,{code:E.invalid_type,expected:L.set,received:r.parsedType}),H;let i=this._def;i.minSize!==null&&r.data.size<i.minSize.value&&(M(r,{code:E.too_small,minimum:i.minSize.value,type:"set",inclusive:!0,exact:!1,message:i.minSize.message}),n.dirty()),i.maxSize!==null&&r.data.size>i.maxSize.value&&(M(r,{code:E.too_big,maximum:i.maxSize.value,type:"set",inclusive:!0,exact:!1,message:i.maxSize.message}),n.dirty());let o=this._def.valueType;function s(p){let c=new Set;for(let u of p){if(u.status==="aborted")return H;u.status==="dirty"&&n.dirty(),c.add(u.value)}return{status:n.value,value:c}}let a=[...r.data.values()].map((p,c)=>o._parse(new wt(r,p,r.path,c)));return r.common.async?Promise.all(a).then(p=>s(p)):s(a)}min(e,n){return new t({...this._def,minSize:{value:e,message:P.toString(n)}})}max(e,n){return new t({...this._def,maxSize:{value:e,message:P.toString(n)}})}size(e,n){return this.min(e,n).max(e,n)}nonempty(e){return this.min(1,e)}};Ar.create=(t,e)=>new Ar({valueType:t,minSize:null,maxSize:null,typeName:$.ZodSet,...Y(e)});var Xo=class t extends J{constructor(){super(...arguments),this.validate=this.implement}_parse(e){let{ctx:n}=this._processInputParams(e);if(n.parsedType!==L.function)return M(n,{code:E.invalid_type,expected:L.function,received:n.parsedType}),H;function r(a,p){return Qr({data:a,path:n.path,errorMaps:[n.common.contextualErrorMap,n.schemaErrorMap,xr(),tn].filter(c=>!!c),issueData:{code:E.invalid_arguments,argumentsError:p}})}function i(a,p){return Qr({data:a,path:n.path,errorMaps:[n.common.contextualErrorMap,n.schemaErrorMap,xr(),tn].filter(c=>!!c),issueData:{code:E.invalid_return_type,returnTypeError:p}})}let o={errorMap:n.common.contextualErrorMap},s=n.data;if(this._def.returns instanceof Tn){let a=this;return Ze(async function(...p){let c=new st([]),u=await a._def.args.parseAsync(p,o).catch(A=>{throw c.addIssue(r(p,A)),c}),g=await Reflect.apply(s,this,u);return await a._def.returns._def.type.parseAsync(g,o).catch(A=>{throw c.addIssue(i(g,A)),c})})}else{let a=this;return Ze(function(...p){let c=a._def.args.safeParse(p,o);if(!c.success)throw new st([r(p,c.error)]);let u=Reflect.apply(s,this,c.data),g=a._def.returns.safeParse(u,o);if(!g.success)throw new st([i(u,g.error)]);return g.data})}}parameters(){return this._def.args}returnType(){return this._def.returns}args(...e){return new t({...this._def,args:Ft.create(e).rest(rn.create())})}returns(e){return new t({...this._def,returns:e})}implement(e){return this.parse(e)}strictImplement(e){return this.parse(e)}static create(e,n,r){return new t({args:e||Ft.create([]).rest(rn.create()),returns:n||rn.create(),typeName:$.ZodFunction,...Y(r)})}},Wn=class extends J{get schema(){return this._def.getter()}_parse(e){let{ctx:n}=this._processInputParams(e);return this._def.getter()._parse({data:n.data,path:n.path,parent:n})}};Wn.create=(t,e)=>new Wn({getter:t,typeName:$.ZodLazy,...Y(e)});var Yn=class extends J{_parse(e){if(e.data!==this._def.value){let n=this._getOrReturnCtx(e);return M(n,{received:n.data,code:E.invalid_literal,expected:this._def.value}),H}return{status:"valid",value:e.data}}get value(){return this._def.value}};Yn.create=(t,e)=>new Yn({value:t,typeName:$.ZodLiteral,...Y(e)});function us(t,e){return new Kn({values:t,typeName:$.ZodEnum,...Y(e)})}var Kn=class t extends J{_parse(e){if(typeof e.data!="string"){let n=this._getOrReturnCtx(e),r=this._def.values;return M(n,{expected:re.joinValues(r),received:n.parsedType,code:E.invalid_type}),H}if(this._cache||(this._cache=new Set(this._def.values)),!this._cache.has(e.data)){let n=this._getOrReturnCtx(e),r=this._def.values;return M(n,{received:n.data,code:E.invalid_enum_value,options:r}),H}return Ze(e.data)}get options(){return this._def.values}get enum(){let e={};for(let n of this._def.values)e[n]=n;return e}get Values(){let e={};for(let n of this._def.values)e[n]=n;return e}get Enum(){let e={};for(let n of this._def.values)e[n]=n;return e}extract(e,n=this._def){return t.create(e,{...this._def,...n})}exclude(e,n=this._def){return t.create(this.options.filter(r=>!e.includes(r)),{...this._def,...n})}};Kn.create=us;var Jn=class extends J{_parse(e){let n=re.getValidEnumValues(this._def.values),r=this._getOrReturnCtx(e);if(r.parsedType!==L.string&&r.parsedType!==L.number){let i=re.objectValues(n);return M(r,{expected:re.joinValues(i),received:r.parsedType,code:E.invalid_type}),H}if(this._cache||(this._cache=new Set(re.getValidEnumValues(this._def.values))),!this._cache.has(e.data)){let i=re.objectValues(n);return M(r,{received:r.data,code:E.invalid_enum_value,options:i}),H}return Ze(e.data)}get enum(){return this._def.values}};Jn.create=(t,e)=>new Jn({values:t,typeName:$.ZodNativeEnum,...Y(e)});var Tn=class extends J{unwrap(){return this._def.type}_parse(e){let{ctx:n}=this._processInputParams(e);if(n.parsedType!==L.promise&&n.common.async===!1)return M(n,{code:E.invalid_type,expected:L.promise,received:n.parsedType}),H;let r=n.parsedType===L.promise?n.data:Promise.resolve(n.data);return Ze(r.then(i=>this._def.type.parseAsync(i,{path:n.path,errorMap:n.common.contextualErrorMap})))}};Tn.create=(t,e)=>new Tn({type:t,typeName:$.ZodPromise,...Y(e)});var xt=class extends J{innerType(){return this._def.schema}sourceType(){return this._def.schema._def.typeName===$.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(e){let{status:n,ctx:r}=this._processInputParams(e),i=this._def.effect||null,o={addIssue:s=>{M(r,s),s.fatal?n.abort():n.dirty()},get path(){return r.path}};if(o.addIssue=o.addIssue.bind(o),i.type==="preprocess"){let s=i.transform(r.data,o);if(r.common.async)return Promise.resolve(s).then(async a=>{if(n.value==="aborted")return H;let p=await this._def.schema._parseAsync({data:a,path:r.path,parent:r});return p.status==="aborted"?H:p.status==="dirty"?Hn(p.value):n.value==="dirty"?Hn(p.value):p});{if(n.value==="aborted")return H;let a=this._def.schema._parseSync({data:s,path:r.path,parent:r});return a.status==="aborted"?H:a.status==="dirty"?Hn(a.value):n.value==="dirty"?Hn(a.value):a}}if(i.type==="refinement"){let s=a=>{let p=i.refinement(a,o);if(r.common.async)return Promise.resolve(p);if(p instanceof Promise)throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");return a};if(r.common.async===!1){let a=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});return a.status==="aborted"?H:(a.status==="dirty"&&n.dirty(),s(a.value),{status:n.value,value:a.value})}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(a=>a.status==="aborted"?H:(a.status==="dirty"&&n.dirty(),s(a.value).then(()=>({status:n.value,value:a.value}))))}if(i.type==="transform")if(r.common.async===!1){let s=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});if(!wn(s))return H;let a=i.transform(s.value,o);if(a instanceof Promise)throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");return{status:n.value,value:a}}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(s=>wn(s)?Promise.resolve(i.transform(s.value,o)).then(a=>({status:n.value,value:a})):H);re.assertNever(i)}};xt.create=(t,e,n)=>new xt({schema:t,typeName:$.ZodEffects,effect:e,...Y(n)});xt.createWithPreprocess=(t,e,n)=>new xt({schema:e,effect:{type:"preprocess",transform:t},typeName:$.ZodEffects,...Y(n)});var bt=class extends J{_parse(e){return this._getType(e)===L.undefined?Ze(void 0):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};bt.create=(t,e)=>new bt({innerType:t,typeName:$.ZodOptional,...Y(e)});var jt=class extends J{_parse(e){return this._getType(e)===L.null?Ze(null):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};jt.create=(t,e)=>new jt({innerType:t,typeName:$.ZodNullable,...Y(e)});var Xn=class extends J{_parse(e){let{ctx:n}=this._processInputParams(e),r=n.data;return n.parsedType===L.undefined&&(r=this._def.defaultValue()),this._def.innerType._parse({data:r,path:n.path,parent:n})}removeDefault(){return this._def.innerType}};Xn.create=(t,e)=>new Xn({innerType:t,typeName:$.ZodDefault,defaultValue:typeof e.default=="function"?e.default:()=>e.default,...Y(e)});var Qn=class extends J{_parse(e){let{ctx:n}=this._processInputParams(e),r={...n,common:{...n.common,issues:[]}},i=this._def.innerType._parse({data:r.data,path:r.path,parent:{...r}});return kr(i)?i.then(o=>({status:"valid",value:o.status==="valid"?o.value:this._def.catchValue({get error(){return new st(r.common.issues)},input:r.data})})):{status:"valid",value:i.status==="valid"?i.value:this._def.catchValue({get error(){return new st(r.common.issues)},input:r.data})}}removeCatch(){return this._def.innerType}};Qn.create=(t,e)=>new Qn({innerType:t,typeName:$.ZodCatch,catchValue:typeof e.catch=="function"?e.catch:()=>e.catch,...Y(e)});var Mr=class extends J{_parse(e){if(this._getType(e)!==L.nan){let r=this._getOrReturnCtx(e);return M(r,{code:E.invalid_type,expected:L.nan,received:r.parsedType}),H}return{status:"valid",value:e.data}}};Mr.create=t=>new Mr({typeName:$.ZodNaN,...Y(t)});var Du=Symbol("zod_brand"),eo=class extends J{_parse(e){let{ctx:n}=this._processInputParams(e),r=n.data;return this._def.type._parse({data:r,path:n.path,parent:n})}unwrap(){return this._def.type}},to=class t extends J{_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.common.async)return(async()=>{let o=await this._def.in._parseAsync({data:r.data,path:r.path,parent:r});return o.status==="aborted"?H:o.status==="dirty"?(n.dirty(),Hn(o.value)):this._def.out._parseAsync({data:o.value,path:r.path,parent:r})})();{let i=this._def.in._parseSync({data:r.data,path:r.path,parent:r});return i.status==="aborted"?H:i.status==="dirty"?(n.dirty(),{status:"dirty",value:i.value}):this._def.out._parseSync({data:i.value,path:r.path,parent:r})}}static create(e,n){return new t({in:e,out:n,typeName:$.ZodPipeline})}},er=class extends J{_parse(e){let n=this._def.innerType._parse(e),r=i=>(wn(i)&&(i.value=Object.freeze(i.value)),i);return kr(n)?n.then(i=>r(i)):r(n)}unwrap(){return this._def.innerType}};er.create=(t,e)=>new er({innerType:t,typeName:$.ZodReadonly,...Y(e)});function as(t,e){let n=typeof t=="function"?t(e):typeof t=="string"?{message:t}:t;return typeof n=="string"?{message:n}:n}function ds(t,e={},n){return t?kn.create().superRefine((r,i)=>{let o=t(r);if(o instanceof Promise)return o.then(s=>{if(!s){let a=as(e,r),p=a.fatal??n??!0;i.addIssue({code:"custom",...a,fatal:p})}});if(!o){let s=as(e,r),a=s.fatal??n??!0;i.addIssue({code:"custom",...s,fatal:a})}}):kn.create()}var Bu={object:lt.lazycreate},$;(function(t){t.ZodString="ZodString",t.ZodNumber="ZodNumber",t.ZodNaN="ZodNaN",t.ZodBigInt="ZodBigInt",t.ZodBoolean="ZodBoolean",t.ZodDate="ZodDate",t.ZodSymbol="ZodSymbol",t.ZodUndefined="ZodUndefined",t.ZodNull="ZodNull",t.ZodAny="ZodAny",t.ZodUnknown="ZodUnknown",t.ZodNever="ZodNever",t.ZodVoid="ZodVoid",t.ZodArray="ZodArray",t.ZodObject="ZodObject",t.ZodUnion="ZodUnion",t.ZodDiscriminatedUnion="ZodDiscriminatedUnion",t.ZodIntersection="ZodIntersection",t.ZodTuple="ZodTuple",t.ZodRecord="ZodRecord",t.ZodMap="ZodMap",t.ZodSet="ZodSet",t.ZodFunction="ZodFunction",t.ZodLazy="ZodLazy",t.ZodLiteral="ZodLiteral",t.ZodEnum="ZodEnum",t.ZodEffects="ZodEffects",t.ZodNativeEnum="ZodNativeEnum",t.ZodOptional="ZodOptional",t.ZodNullable="ZodNullable",t.ZodDefault="ZodDefault",t.ZodCatch="ZodCatch",t.ZodPromise="ZodPromise",t.ZodBranded="ZodBranded",t.ZodPipeline="ZodPipeline",t.ZodReadonly="ZodReadonly"})($||($={}));var Ru=(t,e={message:`Input not instance of ${t.name}`})=>ds(n=>n instanceof t,e),ps=xn.create,ms=$n.create,Pu=Mr.create,Ou=Fn.create,fs=jn.create,Nu=Vn.create,zu=Sr.create,Hu=Un.create,$u=Gn.create,Fu=kn.create,ju=rn.create,Vu=Bt.create,Uu=Er.create,Gu=on.create,qu=lt.create,Zu=lt.strictCreate,Wu=qn.create,Yu=Ko.create,Ku=Zn.create,Ju=Ft.create,Xu=Jo.create,Qu=_r.create,ed=Ar.create,td=Xo.create,nd=Wn.create,rd=Yn.create,od=Kn.create,id=Jn.create,ad=Tn.create,sd=xt.create,ld=bt.create,cd=jt.create,ud=xt.createWithPreprocess,dd=to.create,pd=()=>ps().optional(),md=()=>ms().optional(),fd=()=>fs().optional(),hd={string:(t=>xn.create({...t,coerce:!0})),number:(t=>$n.create({...t,coerce:!0})),boolean:(t=>jn.create({...t,coerce:!0})),bigint:(t=>Fn.create({...t,coerce:!0})),date:(t=>Vn.create({...t,coerce:!0}))};var gd=H;var hs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 5l0 14" />
  <path d="M5 12l14 0" />
</svg>`;var gs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-alarm-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 13a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  <path d="M7 4l-2.75 2" />
  <path d="M17 4l2.75 2" />
  <path d="M10 13h4" />
  <path d="M12 11v4" />
</svg>`;var vs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l14 0" />
</svg>`;var ys=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M9 12h6" />
  <path d="M12 9v6" />
</svg>`;var bs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l6 0" />
</svg>`;var ws=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 7l16 0" />
  <path d="M10 11l0 6" />
  <path d="M14 11l0 6" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
</svg>`;var xs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
  <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
</svg>`;var ks=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
</svg>`;var Ts=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
  <path d="M16 19h6" />
  <path d="M19 16v6" />
  <path d="M12 7v5l3 3" />
</svg>`;var Ss=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
</svg>`;var Es=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
</svg>`;var _s=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
</svg>`;var As=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
</svg>`;var Ms=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-horizontal"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 6l8 0" />
  <path d="M16 6l4 0" />
  <path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 12l2 0" />
  <path d="M10 12l10 0" />
  <path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 18l11 0" />
  <path d="M19 18l1 0" />
</svg>`;var Ls=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
</svg>`;var Is=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
  <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14 4l0 4l-6 0l0 -4" />
</svg>`;var Cs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
</svg>`;var Ds=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
</svg>`;var Bs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
</svg>`;var Rs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
</svg>`;var Ps=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
</svg>`;var Os=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
</svg>`;var Ns=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
</svg>`;var zs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
</svg>`;var Hs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
</svg>`;var $s=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
</svg>`;var Fs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
</svg>`;var js=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
</svg>`;var Vs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
</svg>`;var Us=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
</svg>`;var Gs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
</svg>`;var qs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var Yd={plus:hs,"alarm-plus":gs,minus:vs,"circle-plus":ys,"circle-minus":bs,trash:ws,clipboard:xs,settings:ks,"clock-plus":Ts,"current-location":Ss,"player-record":Es,"circle-x":_s,"circle-check":As,"adjustments-horizontal":Ms,cloud:Ls,"device-floppy":Is,"folder-open":Cs,"file-export":Ds,"file-import":Bs,"file-spreadsheet":Rs,login:Ps,logout:Os,refresh:Ns,"alert-triangle":zs,database:Hs,server:$s,world:Fs,"plug-connected":js,key:Vs,x:Us,"indent-increase":Gs,"indent-decrease":qs},Zs="http://www.w3.org/2000/svg",Kd=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,Jd=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,Xd=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,Ws=new Map;function Ys(t){let e={};for(let n of t.matchAll(Xd))e[n[1]]=n[2];return e}function Qd(t){return t.startsWith("data:image/svg+xml;base64,")?atob(t.slice(26)):t.startsWith("data:image/svg+xml,")?decodeURIComponent(t.slice(19)):t}function ep(t){let e=Qd(t).match(Kd);if(!e)throw new Error("Invalid Tabler SVG source");let[,n,r]=e,i=document.createElementNS(Zs,"svg"),o=Ys(n);for(let[s,a]of Object.entries(o))s!=="class"&&i.setAttribute(s,a);for(let s of r.matchAll(Jd)){let[,a,p]=s,c=document.createElementNS(Zs,a),u=Ys(p);for(let[g,y]of Object.entries(u))c.setAttribute(g,y);i.appendChild(c)}return i}function tp(t){let e=Ws.get(t);if(e)return e;let n=ep(Yd[t]);return Ws.set(t,n),n}function no(t,e=20){let n=tp(t).cloneNode(!0);return n.setAttribute("width",String(e)),n.setAttribute("height",String(e)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function We(t,e,n){t.replaceChildren(no(e,n))}function ge(t,e,n,r){t.replaceChildren(no(e,r),document.createTextNode("\xA0"+n))}var Qo="5.0.24";function d(t,...e){let n="debug",r=[...e];e.length>0&&typeof e[e.length-1]=="string"&&["debug","info","warn","error"].includes(e[e.length-1])&&(n=r.pop());let i=`[Timekeeper v${Qo}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${i} ${t}`,...r)}function Vt(t,e=t){let n=Math.floor(t/3600),r=Math.floor(t%3600/60),i=String(t%60).padStart(2,"0");return e<3600?`${e>=600?String(r).padStart(2,"0"):r}:${i}`:`${e>=36e3?String(n).padStart(2,"0"):n}:${String(r).padStart(2,"0")}:${i}`}function Ri(t,e=window.location.href){try{let n=new URL(e);return n.searchParams.set("t",`${t}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${e.search(/[?&]v=/)>=0?e.split(/[?&]v=/)[1].split(/&/)[0]:e.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${t}s`}}function tr(){let t=new Date;return t.getUTCFullYear()+"-"+String(t.getUTCMonth()+1).padStart(2,"0")+"-"+String(t.getUTCDate()).padStart(2,"0")+"--"+String(t.getUTCHours()).padStart(2,"0")+"-"+String(t.getUTCMinutes()).padStart(2,"0")+"-"+String(t.getUTCSeconds()).padStart(2,"0")}var Ks=`#ytls-pane {
  background: rgba(19, 19, 19, 0.8);
  text-align: left;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0;
  border-radius: 12px;
  /* Add rounded corners */
  border: 1px solid rgba(85, 85, 85, 0.8);
  /* Add a thin grey border */
  opacity: 0.9;
  z-index: 5000;
  font-family: Arial, sans-serif;
  width: 300px;
  height: 90vh;
  min-width: 300px;
  max-width: 800px;
  min-height: 400px;
  max-height: 90vh;
  user-select: none;
  /* Prevent text selection in pane */
  display: flex;
  flex-direction: column;
  will-change: width, height;
  transform: translateZ(0);
  backface-visibility: hidden;
  contain: layout style paint;
  overflow: hidden;
}

#ytls-pane:hover {
  opacity: 1;
}

/* Legacy corner handle: keep element for resize behavior but hide visual indicator */
/* Legacy corner handle kept for compatibility but hidden visually */
#ytls-resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: auto;
  /* no visible corner cursor */
  z-index: 10;
  pointer-events: none;
  /* legacy handle inactive, corners handle events */
  background: transparent;
  margin: 0;
  padding: 0;
}

#ytls-resize-handle::before {
  display: none;
  /* remove the triangular corner indicator */
  content: none;
}

/* Corner handles for diagonal resize */
#ytls-resize-tl,
#ytls-resize-tr,
#ytls-resize-bl,
#ytls-resize-br {
  position: absolute;
  /* Use 16px click areas for corner resize handlers to match touch targets and reduce accidental drags */
  width: 16px;
  height: 16px;
  z-index: 11;
  background: transparent;
  pointer-events: auto;
}

#ytls-resize-tl {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

#ytls-resize-tr {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

#ytls-resize-bl {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

#ytls-resize-br {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}

#ytls-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  position: relative;
}

/* Wrapper that gives the custom scrollbar a positioned ancestor covering only the list area */
#ytls-list-wrapper {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

#ytls-content ul {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 !important;
  border: none !important;
  box-sizing: border-box;
  scrollbar-width: none;
  /* Firefox: hide native scrollbar */
}

#ytls-content ul::-webkit-scrollbar {
  display: none;
  /* WebKit: hide native scrollbar */
}

/* Custom overlay scrollbar track */
.ytls-scrollbar-track {
  --ytls-scrollbar-size: 10px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--ytls-scrollbar-size);
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.ytls-scrollbar-track.ytls-scrollbar-visible {
  opacity: 1;
}

/* Custom overlay scrollbar thumb */
.ytls-scrollbar-thumb {
  position: absolute;
  right: 2px;
  width: calc(var(--ytls-scrollbar-size) - 4px);
  min-height: 30px;
  background: rgba(255, 255, 255, 0.42);
  border-radius: 999px;
  transition: background 0.15s ease;
}

.ytls-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.62);
}

/* Placeholder message shown centered in the list area while loading or when empty */
#ytls-content ul li.ytls-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: #bfbfbf;
  font-size: 14px;
  font-style: italic;
  padding: 12px;
  text-align: center;
  box-sizing: border-box;
}

#ytls-pane-header {
  position: relative;
  z-index: 2;
}

#ytls-buttons {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 10px 18px 10px 16px;
  background: #131313;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #23272b;
  margin-top: auto;
}

#ytls-pane li {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  margin: 0 !important;
  border: none;
  border-top: 1px solid rgba(85, 85, 85, 0.8);
  user-select: none;
  /* Prevent text selection in timestamp items */
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

#ytls-pane li:first-child {
  border-top: none;
}

#ytls-pane li.ytls-timestamp-highlight {
  background: rgba(35, 48, 36, 0.8);
}

#ytls-pane li.ytls-timestamp-pending-delete {
  background: rgba(128, 0, 0, 0.8);
}

#ytls-pane .time-row {
  display: flex;
  gap: 5px;
  align-items: center;
}

#ytls-pane .time-row a {
  flex: 0 0 8ch;
  /* Reserve fixed hh:mm:ss width so controls don't shift */
  width: 8ch;
  min-width: 8ch;
  max-width: 8ch;
  display: inline-block;
  text-align: left;
  /* Align the text to the left */
  overflow: hidden;
  /* Prevent overflow */
  text-overflow: ellipsis;
  /* Add ellipsis for long text */
  white-space: nowrap;
  /* Prevent wrapping */
  font-variant-numeric: tabular-nums;
}

#ytls-pane .time-row .time-diff {
  flex-grow: 1;
  /* Allow time-diff to fill remaining space */
  text-align: right;
  /* Align time diff text to the right, next to trash icon */
}

#ytls-pane .time-row .ytls-row-controls {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 5px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

#ytls-pane li:hover .time-row .ytls-row-controls {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.ytp-progress-bar .ytls-marker {
  position: absolute;
  height: 100%;
  width: 2px;
  background-color: #ff0000;
  cursor: pointer;
}

#ytls-pane [data-time] {
  cursor: pointer;
}

#ytls-pane span,
#ytls-pane a,
#ytls-pane input {
  background: none;
  color: white;
  font-family: inherit;
  font-size: 14px;
  text-decoration: none;
  border: none;
  outline: none;
}

/* Ensure editing controls behave like editable fields despite parent user-select:none */
#ytls-pane input,
#ytls-pane textarea {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  caret-color: white;
}

#ytls-buttons {
  flex-shrink: 0;
  display: flex;
  gap: 5px;
  justify-content: space-between;
  padding: 8px 12px;
  background: #131313;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid rgba(85, 85, 85, 0.8);
  z-index: 2;
  /* Ensure it stays at the bottom */
}

#ytls-buttons button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Styles for main control buttons */
.ytls-main-button {
  background: rgb(39, 39, 39);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  touch-action: manipulation;
}

.ytls-main-button:hover {
  background: rgb(63, 63, 63);
}

.ytls-main-button svg {
  display: block;
  width: 24px;
  height: 24px;
}

/* Pane header and utility styles */
#ytls-pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px 10px 16px;
  white-space: nowrap;
  cursor: default;
  border-radius: 12px 12px 0 0;
  border: none;
  background: linear-gradient(180deg, #23272b 0%, #212121 100%);
  box-shadow: 0 1px 0 0 #23272b;
  flex-shrink: 0;
  color: #fafafa;
}

#ytls-pane .ytls-version-display {
  font-size: 14px;
  color: #666;
  margin-left: auto;
  padding-right: 5px;
  cursor: default;
}

#ytls-pane .ytls-google-user-display {
  font-size: 12px;
  color: #4285f4;
  margin-left: 8px;
  padding: 2px 6px;
  cursor: default;
  background: rgba(66, 133, 244, 0.1);
  border-radius: 4px;
}

#ytls-pane .ytls-backup-status-display {
  font-size: 12px;
  color: #9acd32;
  /* yellowgreen */
  margin-left: 8px;
  padding: 2px 6px;
  cursor: default;
  background: rgba(154, 205, 50, 0.12);
  border-radius: 4px;
}

#ytls-current-time {
  color: white;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

#ytls-playback-speed {
  color: white;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  padding: 0 2px;
  border-radius: 3px;
  outline: none;
  display: inline-block;
  width: 5ch;
  text-align: center;
  transition: filter 0.2s ease;
}

#ytls-playback-speed:hover {
  text-decoration: underline;
}

#ytls-playback-speed.ytls-playback-speed-active {
  color: #f4ba78;
}

#ytls-playback-speed-group {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  align-self: center;
}

/* Backup status indicator (colored dot) */
.ytls-backup-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #666;
  cursor: help;
  flex-shrink: 0;
}

@keyframes ytls-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.25;
  }
}

.ytls-backup-indicator--pulsing {
  animation: ytls-pulse 1.6s ease-in-out infinite;
}

/* Shared modal container styles */
#ytls-settings-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a1a;
  padding: 8px;
  border-radius: 10px;
  z-index: 10000;
  color: white;
  text-align: center;
  width: 200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

#ytls-save-modal,
#ytls-load-modal,
#ytls-delete-all-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  padding: 8px;
  border-radius: 10px;
  z-index: 10000;
  color: white;
  text-align: center;
  width: fit-content;
  max-width: 90vw;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Modal header with tabs and close button */
.ytls-modal-header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 0;
  gap: 10px;
}

/* Modal close button (X in header) */
.ytls-modal-close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  z-index: 1;
}

.ytls-modal-close-button:hover {
  background: #ff6666;
}

/* Styles for settings modal */
#ytls-settings-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  border-radius: 0 4px 4px 4px;
  padding: 10px;
  margin-top: -2px;
  position: relative;
  z-index: 1;
}

/* Section heading */
.ytls-section-heading {
  margin: 0 0 10px 0;
  padding: 0;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

/* Settings nav (tabs) */
#ytls-settings-nav {
  display: flex;
  gap: 6px;
  flex: 0;
}

#ytls-settings-nav .ytls-settings-modal-button {
  flex: 0;
  width: auto;
  height: 24px;
  margin-bottom: 0;
  background: #2a2a2a;
  font-size: 13px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid transparent;
  border-radius: 4px 4px 0 0;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  position: relative;
}

#ytls-settings-nav .ytls-settings-modal-button .ytls-tab-text {
  display: none;
}

#ytls-settings-nav .ytls-settings-modal-button.active .ytls-tab-text {
  display: inline;
}

#ytls-settings-nav .ytls-settings-modal-button:hover {
  background: #3a3a3a;
}

#ytls-settings-nav .ytls-settings-modal-button.active {
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  border-bottom: 2px solid #2a2a2a;
  z-index: 2;
}

/* Button grid container */
.ytls-button-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
  width: 100%;
}

/* Styles for buttons in the settings modal */
.ytls-settings-modal-button {
  width: 100%;
  height: 32px;
  background: #555;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  padding: 0 8px;
  gap: 4px;
}

.ytls-settings-modal-button:hover {
  background: #777;
  /* Example hover effect */
}

/* Tabler icon sizing in pane controls */
#ytls-pane .time-row span svg,
#ytls-pane .time-row button svg {
  display: block;
  flex-shrink: 0;
  pointer-events: none;
}

/* Route SVG clicks to their parent controls for consistent interaction */
.ytls-main-button svg,
.ytls-settings-modal-button svg,
.ytls-save-modal-button svg,
.ytls-save-modal-cancel-button svg,
.ytls-modal-close-button svg,
#ytls-header-button svg {
  pointer-events: none;
}

/* Reduce mobile tap delay for button-like controls */
.ytls-row-control,
.ytls-settings-modal-button,
.ytls-save-modal-button,
.ytls-save-modal-cancel-button,
.ytls-modal-close-button,
#ytls-header-button,
#ytls-buttons button {
  touch-action: manipulation;
}

/* Shared styles for modal copy */
#ytls-save-modal p,
#ytls-load-modal p,
#ytls-delete-all-modal p {
  margin-bottom: 15px;
  font-size: 16px;
}

.ytls-save-modal-button {
  background: #555;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  /* Applied to both JSON and Text buttons, last one will have extra margin if not overridden */
}

.ytls-save-modal-button:last-of-type {
  /* Remove margin from the last button of this type in the modal */
  margin-right: 0;
}

.ytls-save-modal-cancel-button {
  background: #444;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  display: block;
  width: 100%;
}

/* Styles for file operation buttons (Save, Load, Export, Import) if they were to be displayed directly */
/* Note: These buttons (saveBtn, loadBtn, etc.) are not directly added to the UI with these styles. */
/* Their onclick handlers are used by the settings modal buttons which use .ytls-settings-modal-button. */
.ytls-file-operation-button {
  background: #555;
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.ytls-file-operation-button:hover {
  background: #777;
  /* Example hover effect */
}

.ytls-hidden-file-input {
  display: none;
}

#ytls-header-button {
  align-items: center;
  background: transparent;
  border: none;
  color: var(--yt-spec-text-primary, currentColor);
  cursor: pointer;
  display: inline-flex;
  font-size: 20px;
  height: 40px;
  margin-left: 6px;
  padding: 0 6px;
  text-decoration: none;
}

#ytls-header-button:hover {
  color: var(--yt-spec-call-to-action, #3ea6ff);
}

#ytls-header-button:focus-visible {
  outline: 2px solid var(--yt-spec-call-to-action, #3ea6ff);
  outline-offset: 2px;
}

#ytls-header-button img {
  display: block;
  height: 32px;
  max-width: 48px;
  pointer-events: none;
  width: auto;
}

/* Shared fade animations for pane and modals */
.ytls-fade-in {
  animation: fadeIn 0.3s ease-in-out forwards;
}

.ytls-fade-out {
  animation: fadeOut 0.3s ease-in-out forwards;
}

/* Zoom animations for pane expand/collapse */
.ytls-zoom-in {
  animation: zoomIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transform-origin: center center;
}

.ytls-zoom-out {
  animation: zoomOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transform-origin: center center;
}

/* Fade-in animation for modals */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Fade-out animation for modals */
@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

/* Zoom-in animation - expand from point */
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.1);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Zoom-out animation - collapse to point */
@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.1);
  }
}

/* Custom tooltip styles */
.ytls-tooltip {
  position: fixed;
  background: rgba(97, 97, 97, 0.92);
  color: #fff;
  padding: 8px 10px;
  border-radius: 2px;
  font-size: 12px;
  font-family: "Roboto", "Arial", sans-serif;
  font-weight: normal;
  line-height: 1.4;
  letter-spacing: 0.2px;
  z-index: 10001;
  pointer-events: none;
  white-space: pre-line;
  max-width: 300px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.ytls-tooltip.ytls-tooltip-visible {
  opacity: 1;
}
`;var ct=null,Lr=null,np=250,Ut=null,Ir=!1,ut=null,ro=[];function rp(){return(!ct||!document.body.contains(ct))&&(ct=document.createElement("div"),ct.className="ytls-tooltip",ct.style.pointerEvents="none",document.body.appendChild(ct),window.addEventListener("scroll",Js,!0),window.addEventListener("resize",Js,!0)),ct}function op(t,e,n){let i=window.innerWidth,o=window.innerHeight,s=t.getBoundingClientRect(),a=s.width,p=s.height,c=e+10,u=n+10;c+a>i-10&&(c=e-a-10),u+p>o-10&&(u=n-p-10),c=Math.max(10,Math.min(c,i-a-10)),u=Math.max(10,Math.min(u,o-p-10)),t.style.left=`${c}px`,t.style.top=`${u}px`}function Xs(t,e){let r=window.innerWidth,i=window.innerHeight,o=e.getBoundingClientRect(),s=t.getBoundingClientRect(),a=s.width,p=s.height,c=Math.round(o.left+o.width/2-a/2),u=Math.round(o.top-p-8);u<8&&(u=Math.round(o.bottom+8)),c<8&&(c=Math.round(o.left)),c+a>r-8&&(c=Math.round(o.right-a)),c=Math.max(8,Math.min(c,r-a-8)),u=Math.max(8,Math.min(u,i-p-8)),t.style.left=`${c}px`,t.style.top=`${u}px`}function Js(){if(!(!ct||!Ut)&&ct.classList.contains("ytls-tooltip-visible"))try{Xs(ct,Ut)}catch{}}function ip(t=50){ut&&(clearTimeout(ut),ut=null),!Ir&&(ut=setTimeout(()=>{oo(),ut=null},t))}function ap(t,e,n,r){ut&&(clearTimeout(ut),ut=null),Ut&&r&&Ut!==r&&ct?.classList.contains("ytls-tooltip-visible")&&ct.classList.remove("ytls-tooltip-visible"),Lr&&clearTimeout(Lr),r&&(Ut=r,Ir=!0),Lr=setTimeout(()=>{let i=rp();i.textContent=t,i.classList.remove("ytls-tooltip-visible"),r?requestAnimationFrame(()=>{Xs(i,r),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")})}):(op(i,e,n),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")}))},np)}function oo(){Lr&&(clearTimeout(Lr),Lr=null),ut&&(clearTimeout(ut),ut=null),ct&&ct.classList.remove("ytls-tooltip-visible"),Ut=null,Ir=!1}function Pi(){oo()}function dt(t,e){let n=0,r=0,i=c=>{n=c.clientX,r=c.clientY,ut&&(clearTimeout(ut),ut=null),Ir=!0,Ut=t;let u=typeof e=="function"?e():e;u&&ap(u,n,r,t)},o=c=>{n=c.clientX,r=c.clientY},s=()=>{Ut===t&&(Ir=!1,ip())};t.addEventListener("mouseenter",i),t.addEventListener("mousemove",o),t.addEventListener("mouseleave",s);let a=c=>{Ir=!1,Ut===t&&oo()};t.addEventListener("click",a,!0);let p=new MutationObserver(()=>{if(Ut===t)try{let c=window.getComputedStyle(t);(c.display==="none"||c.visibility==="hidden"||c.opacity==="0")&&oo()}catch{}});try{p.observe(t,{attributes:!0,attributeFilter:["class","style"]})}catch{}ro.push(p),t.__tooltipCleanup=()=>{t.removeEventListener("mouseenter",i),t.removeEventListener("mousemove",o),t.removeEventListener("mouseleave",s),t.removeEventListener("click",a,!0);try{p.disconnect()}catch{}let c=ro.indexOf(p);c!==-1&&ro.splice(c,1),delete t.__tooltipObserver},t.__tooltipObserver=p}function Qs(){for(let t of ro)try{t.disconnect()}catch{}ro.length=0,oo()}var Vi={};rs(Vi,{addTimestamp:()=>fp,buildExportCsvPayload:()=>kp,buildExportPayload:()=>wp,deleteSingleTimestampFromIndexedDB:()=>yp,exportAllTimestamps:()=>xp,exportAllTimestampsCsv:()=>Tp,loadFromIndexedDB:()=>vp,loadGlobalSettings:()=>ri,mergeBackupData:()=>Sp,removeFromIndexedDB:()=>bp,saveGlobalSettings:()=>ni,saveSingleTimestampToIndexedDB:()=>gp,saveToIndexedDB:()=>hp});var sp=q.string().min(1),Cr=q.object({guid:sp,start:q.number().finite().nonnegative(),comment:q.string(),write_counter:q.number().int().positive().optional(),deleted_at:q.number().optional().catch(void 0)}),io=Cr.array(),Oi=Cr.extend({video_id:q.string(),device_id:q.string().optional()}),tl=q.object({x:q.number().finite(),y:q.number().finite(),width:q.number().finite().positive().optional(),height:q.number().finite().positive().optional()}),ei=q.object({video_id:q.string(),timestamps:io}),nl=q.record(ei),el=q.object({isSignedIn:q.boolean().catch(!1),accessToken:q.string().nullable().catch(null),userName:q.string().nullable().catch(null),email:q.string().nullable().catch(null)}),Ni=q.union([el,q.string().transform((t,e)=>{try{let n=JSON.parse(t);return el.parse(n)}catch{return e.addIssue({code:q.ZodIssueCode.custom,message:"Invalid JSON string for auth state"}),q.NEVER}})]).catch({isSignedIn:!1,accessToken:null,userName:null,email:null}),lp=q.object({autoBackupEnabled:q.boolean(),autoBackupIntervalMinutes:q.number().int().min(5).max(1440),lastAutoBackupAt:q.number().int().positive().nullable().optional()}),zi=lp;var cp="ytls-timestamps-db",up=4,Dr="timestamps",Ke="timestamps_v2",Ye="settings",Br=null,Rr=null;var Gt=null;function nr(){if(Br)try{return Br.objectStoreNames,Promise.resolve(Br)}catch(t){d("IndexedDB connection is no longer usable:",t,"warn"),Br=null}return Rr||(Rr=dp().then(t=>(Br=t,Rr=null,t.onclose=()=>{d("IndexedDB connection closed unexpectedly","warn"),Br=null},t.onerror=e=>{d("IndexedDB connection error:",e,"error")},t)).catch(t=>{throw Rr=null,t}),Rr)}function rl(t,e){let n=crypto.randomUUID(),r=0,i=t.openCursor();i.onsuccess=o=>{let s=o.target.result;s?(r++,s.update({...s.value,write_counter:r,device_id:n}),s.continue()):(e.put({key:"write_counter",value:r}),e.put({key:"device_id",value:n}),d(`Lamport migration: backfilled ${r} records, device_id=${n}`))},i.onerror=()=>{d("Lamport migration: cursor error during backfill",i.error,"error")}}function dp(){return new Promise((t,e)=>{let n=indexedDB.open(cp,up);n.onupgradeneeded=r=>{let i=r.target.result,o=r.oldVersion,s=r.target.transaction;if(o<1&&i.createObjectStore(Dr,{keyPath:"video_id"}),o<2&&!i.objectStoreNames.contains(Ye)&&i.createObjectStore(Ye,{keyPath:"key"}),o<3){if(i.objectStoreNames.contains(Dr)){d("Exporting backup before v2 migration...");let c=s.objectStore(Dr).getAll();c.onsuccess=()=>{let u=ei.array().safeParse(c.result);if(u.success&&u.data.length>0)try{let g={},y=0;u.data.forEach(z=>{if(z.timestamps.length>0){let X=io.parse(z.timestamps);g[`ytls-${z.video_id}`]={video_id:z.video_id,timestamps:[...X].sort((I,B)=>I.start-B.start)},y+=X.length}});let A=new Blob([JSON.stringify(g,null,2)],{type:"application/json"}),R=URL.createObjectURL(A),V=document.createElement("a");V.href=R,V.download=`timekeeper-data-${tr()}.json`,V.click(),URL.revokeObjectURL(R),d(`Pre-migration backup exported: ${u.data.length} videos, ${y} timestamps`)}catch(g){d("Failed to export pre-migration backup:",g,"error")}else u.success||d("Skipping pre-migration backup: legacy data failed validation",u.error.format(),"warn")}}let a=i.createObjectStore(Ke,{keyPath:"guid"});if(a.createIndex("video_id","video_id",{unique:!1}),a.createIndex("video_start",["video_id","start"],{unique:!1}),i.objectStoreNames.contains(Dr)){let c=s.objectStore(Dr).getAll();c.onsuccess=()=>{let u=ei.array().safeParse(c.result);if(u.success&&u.data.length>0){let g=0;u.data.forEach(y=>{y.timestamps.length>0&&y.timestamps.forEach(A=>{a.put({guid:A.guid,video_id:y.video_id,start:A.start,comment:A.comment}),g++})}),d(`Migrated ${g} timestamps from ${u.data.length} videos to v2 store`)}else u.success||d("Skipping v1 \u2192 v2 migration: legacy data failed validation",u.error.format(),"warn");o<4&&rl(s.objectStore(Ke),s.objectStore(Ye))},i.deleteObjectStore(Dr),d("Deleted old timestamps store after migration to v2")}}o===3&&rl(s.objectStore(Ke),s.objectStore(Ye))},n.onsuccess=r=>{t(r.target.result)},n.onerror=r=>{let i=r.target.error;e(i??new Error("Failed to open IndexedDB"))}})}function Hi(t,e,n){return nr().then(r=>new Promise((i,o)=>{let s;try{s=r.transaction(t,e)}catch(c){o(new Error(`Failed to create transaction for ${t}: ${c}`));return}let a=s.objectStore(t),p;try{p=n(a)}catch(c){o(new Error(`Failed to execute operation on ${t}: ${c}`));return}p&&(p.onsuccess=()=>i(p.result),p.onerror=()=>o(p.error??new Error(`IndexedDB ${e} operation failed`))),s.oncomplete=()=>{p||i(void 0)},s.onerror=()=>o(s.error??new Error("IndexedDB transaction failed")),s.onabort=()=>o(s.error??new Error("IndexedDB transaction aborted"))}))}function ol(t,e){let n=io.safeParse(e);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${t}`));let r=n.data;return nr().then(i=>new Promise((o,s)=>{let a;try{a=i.transaction([Ke,Ye],"readwrite")}catch(y){s(new Error(`Failed to create transaction: ${y}`));return}a.oncomplete=()=>o(),a.onerror=()=>s(new Error(`IndexedDB save failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>s(new Error("IndexedDB transaction aborted"));let p=a.objectStore(Ke),c=a.objectStore(Ye),g=p.index("video_id").getAll(IDBKeyRange.only(t));g.onsuccess=()=>{try{let y=g.result??[],A=new Map(y.map(I=>[I.guid,I])),R=new Set(r.map(I=>I.guid)),V=Date.now(),z,X=c.get("write_counter");X.onsuccess=()=>{try{z=typeof X.result?.value=="number"?X.result.value:0}catch{z=0}y.forEach(I=>{!R.has(I.guid)&&!I.deleted_at&&(z++,p.put({...I,deleted_at:V,write_counter:z}))}),r.forEach(I=>{let B=A.get(I.guid);if(B&&!B.deleted_at&&B.start===I.start&&B.comment===I.comment&&B.deleted_at===I.deleted_at)p.put({guid:I.guid,video_id:t,start:I.start,comment:I.comment,write_counter:B.write_counter,deleted_at:I.deleted_at,device_id:B.device_id});else{z++;let ue=I.deleted_at??B?.deleted_at??void 0;p.put({guid:I.guid,video_id:t,start:I.start,comment:I.comment,write_counter:z,deleted_at:ue})}}),c.put({key:"write_counter",value:z}),Gt=z},X.onerror=()=>{d("Failed to read write_counter during save, proceeding with counter=0",X.error,"warn"),z=0,y.forEach(I=>{!R.has(I.guid)&&!I.deleted_at&&(z++,p.put({...I,deleted_at:V,write_counter:z}))}),r.forEach(I=>{let B=A.get(I.guid);if(B&&!B.deleted_at&&B.start===I.start&&B.comment===I.comment&&B.deleted_at===I.deleted_at)p.put({guid:I.guid,video_id:t,start:I.start,comment:I.comment,write_counter:B.write_counter,deleted_at:I.deleted_at,device_id:B.device_id});else{z++;let ue=I.deleted_at??B?.deleted_at??void 0;p.put({guid:I.guid,video_id:t,start:I.start,comment:I.comment,write_counter:z,deleted_at:ue})}}),c.put({key:"write_counter",value:z}),Gt=z}}catch(y){s(y instanceof Error?y:new Error(String(y)))}},g.onerror=()=>{let y=`Failed to load existing records for save: ${g.error?.message??"unknown"}`;d(y,g.error,"error"),s(new Error(y))}}))}function il(t,e){let n=Cr.safeParse(e);if(!n.success)return Promise.reject(new Error(`Invalid timestamp: ${n.error.message}`));let r=n.data;return nr().then(i=>new Promise((o,s)=>{let a;try{a=i.transaction([Ke,Ye],"readwrite")}catch(g){s(new Error(`Failed to create transaction: ${g}`));return}a.oncomplete=()=>o(),a.onerror=()=>s(new Error(`IndexedDB save failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>s(new Error("IndexedDB transaction aborted"));let p=a.objectStore(Ke),c=a.objectStore(Ye);p.put({guid:r.guid,video_id:t,start:r.start,comment:r.comment,write_counter:0,deleted_at:r.deleted_at});let u=c.get("write_counter");u.onsuccess=()=>{try{let g=typeof u.result?.value=="number"?u.result.value:0;p.put({guid:r.guid,video_id:t,start:r.start,comment:r.comment,write_counter:g+1,deleted_at:r.deleted_at}),c.put({key:"write_counter",value:g+1}),Gt=g+1}catch(g){s(g instanceof Error?g:new Error(String(g)))}},u.onerror=()=>{p.put({guid:r.guid,video_id:t,start:r.start,comment:r.comment,write_counter:1,deleted_at:r.deleted_at}),c.put({key:"write_counter",value:1}),Gt=1}}))}function al(t){return t.length===0?Promise.resolve():nr().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke,Ye],"readwrite")}catch(c){r(new Error(`Failed to create transaction: ${c}`));return}i.oncomplete=()=>n(),i.onerror=()=>r(new Error(`IndexedDB batch save failed: ${i.error?.message??"unknown"}`)),i.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=i.objectStore(Ke),s=i.objectStore(Ye),a=0;t.forEach(c=>{c.write_counter!==void 0&&c.write_counter>a&&(a=c.write_counter)}),t.forEach(c=>{let u={guid:c.guid,video_id:c.video_id,start:c.start,comment:c.comment,deleted_at:c.deleted_at};c.write_counter===void 0?(a++,u.write_counter=a):u.write_counter=c.write_counter,o.put(u)});let p=s.get("write_counter");p.onsuccess=()=>{try{let c=typeof p.result?.value=="number"?p.result.value:0,u=Math.max(a,c)+1;s.put({key:"write_counter",value:u}),Gt=u}catch(c){r(c instanceof Error?c:new Error(String(c)))}},p.onerror=()=>{s.put({key:"write_counter",value:a+1}),Gt=a+1}}))}function sl(t){return d(`Soft-deleting timestamp ${t}`),nr().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke,Ye],"readwrite")}catch(p){r(new Error(`Failed to create transaction: ${p}`));return}i.oncomplete=()=>n(),i.onerror=()=>r(new Error(`IndexedDB delete failed: ${i.error?.message??"unknown"}`)),i.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=i.objectStore(Ke),s=i.objectStore(Ye),a=o.get(t);a.onsuccess=()=>{try{let p=a.result;if(p){let c=s.get("write_counter");c.onsuccess=()=>{try{let u=typeof c.result?.value=="number"?c.result.value:0;o.put({...p,deleted_at:Date.now(),write_counter:u+1}),s.put({key:"write_counter",value:u+1}),Gt=u+1}catch(u){r(u instanceof Error?u:new Error(String(u)))}},c.onerror=()=>{o.put({...p,deleted_at:Date.now(),write_counter:1}),s.put({key:"write_counter",value:1}),Gt=1}}}catch(p){r(p instanceof Error?p:new Error(String(p)))}},a.onerror=()=>{let p=`Failed to load record for deletion: ${a.error?.message??"unknown"}`;d(p,a.error,"error"),r(new Error(p))}}))}function ll(t){return nr().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke],"readonly")}catch(s){let a=`Failed to create read transaction: ${s}`;d(a,s,"error"),r(new Error(a));return}i.onabort=()=>{let s=`Transaction aborted during load: ${i.error?.message??"unknown"}`;d(s,i.error,"error"),r(new Error(s))};let o=i.objectStore(Ke).index("video_id").getAll(IDBKeyRange.only(t));o.onsuccess=()=>{try{let s=o.result.filter(c=>!c.deleted_at);if(s.length===0){n(null);return}let a=s.map(c=>({guid:c.guid,start:c.start,comment:c.comment})),p=io.safeParse(a);if(!p.success){d("Failed to parse timestamps from IndexedDB:",p.error.format(),"warn"),n(null);return}n([...p.data].sort((c,u)=>c.start-u.start))}catch(s){r(s)}},o.onerror=()=>{let s=`Failed to load timestamps from IndexedDB: ${o.error?.message??"unknown error"}`;d(s,o.error,"error"),r(new Error(s))}}))}function cl(t){return nr().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke,Ye],"readwrite")}catch(c){r(new Error(`Failed to create transaction: ${c}`));return}i.oncomplete=()=>n(),i.onerror=()=>r(new Error(`IndexedDB delete failed: ${i.error?.message??"unknown"}`)),i.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=i.objectStore(Ke),s=i.objectStore(Ye),p=o.index("video_id").getAll(IDBKeyRange.only(t));p.onsuccess=()=>{try{let c=p.result??[],u=Date.now(),g=s.get("write_counter");g.onsuccess=()=>{try{let y;y=typeof g.result?.value=="number"?g.result.value:0,c.forEach(A=>{A.deleted_at||(y++,o.put({...A,deleted_at:u,write_counter:y}))}),s.put({key:"write_counter",value:y}),Gt=y}catch(y){r(y instanceof Error?y:new Error(String(y)))}},g.onerror=()=>{let y=0;c.forEach(A=>{A.deleted_at||(y++,o.put({...A,deleted_at:u,write_counter:y}))}),s.put({key:"write_counter",value:y}),Gt=y}}catch(c){r(c instanceof Error?c:new Error(String(c)))}},p.onerror=()=>{let c=`Failed to load records for deletion: ${p.error?.message??"unknown"}`;d(c,p.error,"error"),r(new Error(c))}}))}function ti(){return Hi(Ke,"readonly",t=>t.getAll()).then(t=>Array.isArray(t)?t:[])}function ul(t,e){return Hi(Ye,"readwrite",n=>{n.put({key:t,value:e})}).then(()=>{}).catch(n=>{d(`Failed to save setting '${t}' to IndexedDB:`,n,"error")})}function dl(t){return Hi(Ye,"readonly",e=>e.get(t)).then(e=>e?.value).catch(e=>{d(`Failed to load setting '${t}' from IndexedDB:`,e,"error")})}async function $i({includeDeleted:t=!1}={}){let e={},n=await ti(),r=Oi.array().safeParse(n);if(!r.success)return d("Failed to parse timestamp rows for export:",r.error.format(),"warn"),{json:"{}",filename:"timekeeper-data.json",totalVideos:0,totalTimestamps:0};let o=[...t?r.data:r.data.filter(u=>!u.deleted_at)].sort((u,g)=>{let y=u.video_id.localeCompare(g.video_id);if(y!==0)return y;let A=u.start-g.start;return A!==0?A:u.guid.localeCompare(g.guid)}),s=new Map;for(let u of o)s.has(u.video_id)||s.set(u.video_id,[]),s.get(u.video_id).push({guid:u.guid,start:u.start,comment:u.comment,write_counter:u.write_counter,deleted_at:u.deleted_at});let a=Array.from(s.keys()).sort((u,g)=>u.localeCompare(g));for(let u of a){let g=s.get(u);e[`ytls-${u}`]={video_id:u,timestamps:g}}return{json:JSON.stringify(e,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:o.length}}async function pl(){try{let{json:t,filename:e,totalVideos:n,totalTimestamps:r}=await $i(),i=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(i),s=document.createElement("a");s.href=o,s.download=e,s.click(),URL.revokeObjectURL(o),d(`Exported ${n} videos with ${r} timestamps`)}catch(t){throw d("Failed to export data:",t,"error"),t}}async function Fi(){let t=Oi.array().safeParse((await ti()).filter(u=>!u.deleted_at));if(!t.success||t.data.length===0){t.success||d("Failed to parse timestamp rows for CSV export:",t.error.format(),"warn");let u=`Tag,Timestamp,URL
`,g=`timestamps-${tr()}.csv`;return{csv:u,filename:g,totalVideos:0,totalTimestamps:0}}let e=t.data,n=new Map;for(let u of e)n.has(u.video_id)||n.set(u.video_id,[]),n.get(u.video_id).push({start:u.start,comment:u.comment});let r=[];r.push("Tag,Timestamp,URL");let i=0,o=u=>`"${String(u).replace(/"/g,'""')}"`,s=u=>{let g=Math.floor(u/3600),y=Math.floor(u%3600/60),A=String(u%60).padStart(2,"0");return`${String(g).padStart(2,"0")}:${String(y).padStart(2,"0")}:${A}`},a=Array.from(n.keys()).sort();for(let u of a){let g=n.get(u).sort((y,A)=>y.start-A.start);for(let y of g){let A=y.comment,R=s(y.start),V=Ri(y.start,`https://www.youtube.com/watch?v=${u}`);r.push([o(A),o(R),o(V)].join(",")),i++}}let p=r.join(`
`),c=`timestamps-${tr()}.csv`;return{csv:p,filename:c,totalVideos:n.size,totalTimestamps:i}}async function ml(){try{let{csv:t,filename:e,totalVideos:n,totalTimestamps:r}=await Fi(),i=new Blob([t],{type:"text/csv;charset=utf-8;"}),o=URL.createObjectURL(i),s=document.createElement("a");s.href=o,s.download=e,s.click(),URL.revokeObjectURL(o),d(`Exported ${n} videos with ${r} timestamps (CSV)`)}catch(t){throw d("Failed to export CSV data:",t,"error"),t}}async function ji(t,e){if(!t)throw new Error("Video ID is required");if(!e.guid||e.start==null)throw new Error("Timestamp must have GUID and start time");return il(t,e)}async function fl(t,e){if(!t)throw new Error("Video ID is required");if(!Array.isArray(e))throw new Error("Timestamps must be an array");return ol(t,e)}async function hl(t){if(!t)throw new Error("GUID is required");return sl(t)}async function gl(t){if(!t)throw new Error("Video ID is required");return cl(t)}async function vl(t){if(!t)throw new Error("Video ID is required");return ll(t)}async function yl(t){let e;try{e=JSON.parse(t)}catch{return d("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=nl.safeParse(e);if(!n.success)return d("mergeBackupData: data failed validation",n.error.format(),"warn"),{mergedVideos:0,mergedTimestamps:0};let r=await ti(),i=new Map;for(let p of r)i.set(p.guid,p);let o=0,s=0,a=[];for(let[,p]of Object.entries(n.data)){let{video_id:c,timestamps:u}=p,g=0;for(let y of u){let A=i.get(y.guid),R=!1;A?A.write_counter!==void 0&&y.write_counter!==void 0&&y.write_counter>A.write_counter&&(R=!0):R=!0,R&&(a.push({guid:y.guid,video_id:c,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),i.set(y.guid,{...A??{},guid:y.guid,video_id:c,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),g++,s++)}g>0&&o++}return await al(a),{mergedVideos:o,mergedTimestamps:s}}function bl(t,e){if(!t)throw new Error("Setting key is required");return ul(t,e)}async function wl(t){if(!t)throw new Error("Setting key is required");return dl(t)}function fp(t,e){return ji(t,e)}function hp(t,e){return fl(t,e)}function gp(t,e){return ji(t,e)}function vp(t){return vl(t)}function yp(t,e){return hl(e)}function bp(t){return gl(t)}function ni(t,e){bl(t,e)}function ri(t){return wl(t)}function wp(t){return $i(t)}function xp(){return pl()}function kp(){return Fi()}function Tp(){return ml()}function Sp(t){return yl(t)}var Ep=!1,_p=null;function oi(t){return t?Array.from(t.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function ii(t){if(!t)return;t.replaceChildren(),_p=null;let e=t.querySelector(".ytls-error-message");e&&e.remove()}function Ui(t,e){if(!t)return;ii(t);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=e,t.appendChild(n),t.style.overflowY="hidden"}function xl(t){if(!t)return;let e=t.querySelector(".ytls-placeholder");e&&e.remove(),t.style.overflowY=""}function ao(t){return t?t.querySelector(".ytls-error-message")!==null:!1}function kl(t,e){if(!t)return;ii(t);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
    color: #ff4d4f;
    text-align: center;
    padding: 16px;
    background: rgba(255, 0, 0, 0.08);
    border: 1px solid rgba(255, 77, 79, 0.3);
    border-radius: 6px;
    margin: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.5;
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${Ap(e)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,t.appendChild(n),t.style.overflowY="hidden"}function Tl(t){if(!t)return;let e=t.querySelector(".ytls-error-message");e&&e.remove()}function Ap(t){let e=document.createElement("div");return e.textContent=t,e.innerHTML}function Sl(t,e){if(!t||e||ao(t))return;Array.from(t.children).some(r=>!r.classList.contains("ytls-placeholder")&&!r.classList.contains("ytls-error-message"))||Ui(t,"No timestamps for this video")}function El(t){if(!t)return[];let e=oi(t),n=[];return e.forEach(r=>{let i=r.querySelector("[data-time]"),o=r.querySelector("input"),s=r.dataset.guid;if(!i||!o||!s)return;let a=i.dataset.time;if(!a)return;let p=Number.parseInt(a,10);Number.isFinite(p)&&n.push({guid:s,start:p,comment:o.value})}),n.sort((r,i)=>r.start-i.start)}function so(t){Ep=t}function _l(t){if(!t)return 0;let e=oi(t),n=0;return e.forEach(r=>{let o=r.querySelector("[data-time]")?.dataset.time;if(o){let s=Number.parseInt(o,10);Number.isFinite(s)&&(n=Math.max(n,s))}}),n}var Lp={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},Je=JSON.parse(JSON.stringify(Lp)),Al=new Set;function ze(){return Je}function lo(t){let e=Al.size>0?JSON.parse(JSON.stringify(Je)):Je;Je={...Je,...t,auth:{...Je.auth,...t.auth||{}},ui:{...Je.ui,...t.ui||{}},timestamps:{...Je.timestamps,...t.timestamps||{}}},Ip(e)}function rr(t,e){lo({auth:{...Je.auth,[t]:e}})}function ai(t,e){lo({ui:{...Je.ui,[t]:e}})}function qt(){return Je.auth.googleAuthState}function Rt(t){rr("googleAuthState",t)}function Gi(t){rr("autoBackupEnabled",t)}function qi(t){rr("autoBackupIntervalMinutes",t)}function Zi(t){rr("isAutoBackupRunning",t)}function si(t){rr("autoBackupRetryAttempts",t)}function Pr(t){rr("autoBackupBackoffMs",t)}function Wi(t){rr("lastAutoBackupAt",t)}function Ml(t){ai("minPaneHeight",t)}function Ll(t){ai("panePosition",t)}function Il(t){ai("lastHandledUrl",t)}function Cl(t){ai("urlChangeHandlersSetup",t)}function Dl(t){lo({timestamps:{...Je.timestamps,items:t}})}function Bl(t){lo({timestamps:{...Je.timestamps,currentIndex:t}})}function Yi(t){lo({timestamps:{...Je.timestamps,dbError:t}})}function Rl(){return Je.timestamps.dbError}function Ip(t){Al.forEach(e=>{try{e(Je,t)}catch(n){console.error("Error in state listener:",n)}})}var or=typeof unsafeWindow<"u"?unsafeWindow:window,Fl=43200*14,Ol="html5_max_live_dvr_window_plus_margin_secs";function an(t){return t!=null&&typeof t=="object"}function Nl(t){let{streamingData:e,videoDetails:n,playerConfig:r,microformat:i}=t;if(!(!an(n)||!n.isLive)){if(n.isLiveDvrEnabled=!0,an(r)){let o=r.mediaCommonConfig;if(an(o)){o.useServerDrivenAbr=!1;let s=o.serverPlaybackStartConfig;an(s)&&(s.enable=!1)}}if(an(e)){let o=e;if(o.serverAbrStreamingUrl&&(o.hlsManifestUrl||o.dashManifestUrl)&&delete o.serverAbrStreamingUrl,Array.isArray(o.adaptiveFormats)&&Cp(i))for(let s of o.adaptiveFormats)s.maxDvrDurationSec=Fl}}}function Cp(t){if(!an(t))return!1;let e=t.playerMicroformatRenderer;if(!an(e))return!1;let n=e.liveBroadcastDetails;if(!an(n))return!1;let r=n.startTimestamp;return!r||typeof r!="string"?!1:(Date.now()-new Date(r).getTime())/1e3>43200}function Ki(t){if(!t||typeof t!="object")return!1;let e=t;return e.videoDetails?(Nl(e),!0):e.playerResponse&&an(e.playerResponse)&&e.playerResponse.videoDetails?(Nl(e.playerResponse),!0):!1}function Dp(){let t=Object.getOwnPropertyDescriptor(or,"ytInitialPlayerResponse"),e=t&&t.set,n=or.ytInitialPlayerResponse;if(!Ki(n))try{Object.defineProperty(or,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(r){e&&e.call(this,r),n=r,Ki(r)&&Object.defineProperty(or,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:r})}})}catch{}}var zl=!1;function Bp(){if(zl)return;zl=!0;let t=JSON.parse;JSON.parse=function(e,n){let r=t.call(this,e,n);try{Ki(r)}catch{}return r}}function Hl(t){if(t.__dvrCapLifted)return;let n=(typeof t.d=="function"?t.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let r=n;for(let i in r){let o=r[i];if(o&&typeof o.serializedExperimentFlags=="string"){let s=o.serializedExperimentFlags,a=s.replace(new RegExp(`${Ol}=[\\d.]+`),`${Ol}=${Fl}`);a!==s&&(o.serializedExperimentFlags=a)}}t.__dvrCapLifted=!0}function $l(t){if(!t||t.__dvrHooked)return t;t.__dvrHooked=!0;let e=t.set;typeof e=="function"&&(t.set=function(...n){let r=e.apply(this,n);try{Hl(t)}catch{}return r});try{Hl(t)}catch{}return t}function Rp(){let t={};or.ytcfg&&(t=$l(or.ytcfg));try{Object.defineProperty(or,"ytcfg",{configurable:!0,get(){return t},set(e){t=$l(e)}})}catch{}}function jl(){Dp(),Bp(),Rp(),d("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Te=Uint8Array,ht=Uint16Array,sa=Int32Array,li=new Te([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ci=new Te([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ta=new Te([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Yl=function(t,e){for(var n=new ht(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new sa(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},Kl=Yl(li,2),Jl=Kl.b,na=Kl.r;Jl[28]=258,na[258]=28;var Xl=Yl(ci,0),Pp=Xl.b,Vl=Xl.r,ra=new ht(32768);for(le=0;le<32768;++le)sn=(le&43690)>>1|(le&21845)<<1,sn=(sn&52428)>>2|(sn&13107)<<2,sn=(sn&61680)>>4|(sn&3855)<<4,ra[le]=((sn&65280)>>8|(sn&255)<<8)>>1;var sn,le,Wt=(function(t,e,n){for(var r=t.length,i=0,o=new ht(e);i<r;++i)t[i]&&++o[t[i]-1];var s=new ht(e);for(i=1;i<e;++i)s[i]=s[i-1]+o[i-1]<<1;var a;if(n){a=new ht(1<<e);var p=15-e;for(i=0;i<r;++i)if(t[i])for(var c=i<<4|t[i],u=e-t[i],g=s[t[i]-1]++<<u,y=g|(1<<u)-1;g<=y;++g)a[ra[g]>>p]=c}else for(a=new ht(r),i=0;i<r;++i)t[i]&&(a[i]=ra[s[t[i]-1]++]>>15-t[i]);return a}),Sn=new Te(288);for(le=0;le<144;++le)Sn[le]=8;var le;for(le=144;le<256;++le)Sn[le]=9;var le;for(le=256;le<280;++le)Sn[le]=7;var le;for(le=280;le<288;++le)Sn[le]=8;var le,po=new Te(32);for(le=0;le<32;++le)po[le]=5;var le,Op=Wt(Sn,9,0),Np=Wt(Sn,9,1),zp=Wt(po,5,0),Hp=Wt(po,5,1),Ji=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},Pt=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},Xi=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},la=function(t){return(t+7)/8|0},mo=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new Te(t.subarray(e,n))};var $p=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Xe=function(t,e,n){var r=new Error(e||$p[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,Xe),!n)throw r;return r},Fp=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new Te(0);var s=!n,a=s||e.i!=2,p=e.i;s&&(n=new Te(i*3));var c=function(Mn){var cn=n.length;if(Mn>cn){var un=new Te(Math.max(cn*2,Mn));un.set(n),n=un}},u=e.f||0,g=e.p||0,y=e.b||0,A=e.l,R=e.d,V=e.m,z=e.n,X=i*8;do{if(!A){u=Pt(t,g,1);var I=Pt(t,g+1,3);if(g+=3,I)if(I==1)A=Np,R=Hp,V=9,z=5;else if(I==2){var Se=Pt(t,g,31)+257,be=Pt(t,g+10,15)+4,Q=Se+Pt(t,g+5,31)+1;g+=14;for(var U=new Te(Q),Ce=new Te(19),we=0;we<be;++we)Ce[ta[we]]=Pt(t,g+we*3,7);g+=be*3;for(var He=Ji(Ce),Kt=(1<<He)-1,Me=Wt(Ce,He,1),we=0;we<Q;){var De=Me[Pt(t,g,Kt)];g+=De&15;var B=De>>4;if(B<16)U[we++]=B;else{var xe=0,fe=0;for(B==16?(fe=3+Pt(t,g,3),g+=2,xe=U[we-1]):B==17?(fe=3+Pt(t,g,7),g+=3):B==18&&(fe=11+Pt(t,g,127),g+=7);fe--;)U[we++]=xe}}var $e=U.subarray(0,Se),Le=U.subarray(Se);V=Ji($e),z=Ji(Le),A=Wt($e,V,1),R=Wt(Le,z,1)}else Xe(1);else{var B=la(g)+4,se=t[B-4]|t[B-3]<<8,ue=B+se;if(ue>i){p&&Xe(0);break}a&&c(y+se),n.set(t.subarray(B,ue),y),e.b=y+=se,e.p=g=ue*8,e.f=u;continue}if(g>X){p&&Xe(0);break}}a&&c(y+131072);for(var _n=(1<<V)-1,Qe=(1<<z)-1,St=g;;St=g){var xe=A[Xi(t,g)&_n],Be=xe>>4;if(g+=xe&15,g>X){p&&Xe(0);break}if(xe||Xe(2),Be<256)n[y++]=Be;else if(Be==256){St=g,A=null;break}else{var _e=Be-254;if(Be>264){var we=Be-257,ae=li[we];_e=Pt(t,g,(1<<ae)-1)+Jl[we],g+=ae}var Re=R[Xi(t,g)&Qe],Fe=Re>>4;Re||Xe(3),g+=Re&15;var Le=Pp[Fe];if(Fe>3){var ae=ci[Fe];Le+=Xi(t,g)&(1<<ae)-1,g+=ae}if(g>X){p&&Xe(0);break}a&&c(y+131072);var Et=y+_e;if(y<Le){var An=o-Le,sr=Math.min(Le,Et);for(An+y<0&&Xe(3);y<sr;++y)n[y]=r[An+y]}for(;y<Et;++y)n[y]=n[y-Le]}}e.l=A,e.p=St,e.b=y,e.f=u,A&&(u=1,e.m=V,e.d=R,e.n=z)}while(!u);return y!=n.length&&s?mo(n,0,y):n.subarray(0,y)},ln=function(t,e,n){n<<=e&7;var r=e/8|0;t[r]|=n,t[r+1]|=n>>8},co=function(t,e,n){n<<=e&7;var r=e/8|0;t[r]|=n,t[r+1]|=n>>8,t[r+2]|=n>>16},Qi=function(t,e){for(var n=[],r=0;r<t.length;++r)t[r]&&n.push({s:r,f:t[r]});var i=n.length,o=n.slice();if(!i)return{t:ec,l:0};if(i==1){var s=new Te(n[0].s+1);return s[n[0].s]=1,{t:s,l:1}}n.sort(function(ue,Se){return ue.f-Se.f}),n.push({s:-1,f:25001});var a=n[0],p=n[1],c=0,u=1,g=2;for(n[0]={s:-1,f:a.f+p.f,l:a,r:p};u!=i-1;)a=n[n[c].f<n[g].f?c++:g++],p=n[c!=u&&n[c].f<n[g].f?c++:g++],n[u++]={s:-1,f:a.f+p.f,l:a,r:p};for(var y=o[0].s,r=1;r<i;++r)o[r].s>y&&(y=o[r].s);var A=new ht(y+1),R=oa(n[u-1],A,0);if(R>e){var r=0,V=0,z=R-e,X=1<<z;for(o.sort(function(Se,be){return A[be.s]-A[Se.s]||Se.f-be.f});r<i;++r){var I=o[r].s;if(A[I]>e)V+=X-(1<<R-A[I]),A[I]=e;else break}for(V>>=z;V>0;){var B=o[r].s;A[B]<e?V-=1<<e-A[B]++-1:++r}for(;r>=0&&V;--r){var se=o[r].s;A[se]==e&&(--A[se],++V)}R=e}return{t:new Te(A),l:R}},oa=function(t,e,n){return t.s==-1?Math.max(oa(t.l,e,n+1),oa(t.r,e,n+1)):e[t.s]=n},Ul=function(t){for(var e=t.length;e&&!t[--e];);for(var n=new ht(++e),r=0,i=t[0],o=1,s=function(p){n[r++]=p},a=1;a<=e;++a)if(t[a]==i&&a!=e)++o;else{if(!i&&o>2){for(;o>138;o-=138)s(32754);o>2&&(s(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(s(i),--o;o>6;o-=6)s(8304);o>2&&(s(o-3<<5|8208),o=0)}for(;o--;)s(i);o=1,i=t[a]}return{c:n.subarray(0,r),n:e}},uo=function(t,e){for(var n=0,r=0;r<e.length;++r)n+=t[r]*e[r];return n},Ql=function(t,e,n){var r=n.length,i=la(e+2);t[i]=r&255,t[i+1]=r>>8,t[i+2]=t[i]^255,t[i+3]=t[i+1]^255;for(var o=0;o<r;++o)t[i+o+4]=n[o];return(i+4+r)*8},Gl=function(t,e,n,r,i,o,s,a,p,c,u){ln(e,u++,n),++i[256];for(var g=Qi(i,15),y=g.t,A=g.l,R=Qi(o,15),V=R.t,z=R.l,X=Ul(y),I=X.c,B=X.n,se=Ul(V),ue=se.c,Se=se.n,be=new ht(19),Q=0;Q<I.length;++Q)++be[I[Q]&31];for(var Q=0;Q<ue.length;++Q)++be[ue[Q]&31];for(var U=Qi(be,7),Ce=U.t,we=U.l,He=19;He>4&&!Ce[ta[He-1]];--He);var Kt=c+5<<3,Me=uo(i,Sn)+uo(o,po)+s,De=uo(i,y)+uo(o,V)+s+14+3*He+uo(be,Ce)+2*be[16]+3*be[17]+7*be[18];if(p>=0&&Kt<=Me&&Kt<=De)return Ql(e,u,t.subarray(p,p+c));var xe,fe,$e,Le;if(ln(e,u,1+(De<Me)),u+=2,De<Me){xe=Wt(y,A,0),fe=y,$e=Wt(V,z,0),Le=V;var _n=Wt(Ce,we,0);ln(e,u,B-257),ln(e,u+5,Se-1),ln(e,u+10,He-4),u+=14;for(var Q=0;Q<He;++Q)ln(e,u+3*Q,Ce[ta[Q]]);u+=3*He;for(var Qe=[I,ue],St=0;St<2;++St)for(var Be=Qe[St],Q=0;Q<Be.length;++Q){var _e=Be[Q]&31;ln(e,u,_n[_e]),u+=Ce[_e],_e>15&&(ln(e,u,Be[Q]>>5&127),u+=Be[Q]>>12)}}else xe=Op,fe=Sn,$e=zp,Le=po;for(var Q=0;Q<a;++Q){var ae=r[Q];if(ae>255){var _e=ae>>18&31;co(e,u,xe[_e+257]),u+=fe[_e+257],_e>7&&(ln(e,u,ae>>23&31),u+=li[_e]);var Re=ae&31;co(e,u,$e[Re]),u+=Le[Re],Re>3&&(co(e,u,ae>>5&8191),u+=ci[Re])}else co(e,u,xe[ae]),u+=fe[ae]}return co(e,u,xe[256]),u+fe[256]},jp=new sa([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),ec=new Te(0),Vp=function(t,e,n,r,i,o){var s=o.z||t.length,a=new Te(r+s+5*(1+Math.ceil(s/7e3))+i),p=a.subarray(r,a.length-i),c=o.l,u=(o.r||0)&7;if(e){u&&(p[0]=o.r>>3);for(var g=jp[e-1],y=g>>13,A=g&8191,R=(1<<n)-1,V=o.p||new ht(32768),z=o.h||new ht(R+1),X=Math.ceil(n/3),I=2*X,B=function(Hr){return(t[Hr]^t[Hr+1]<<X^t[Hr+2]<<I)&R},se=new sa(25e3),ue=new ht(288),Se=new ht(32),be=0,Q=0,U=o.i||0,Ce=0,we=o.w||0,He=0;U+2<s;++U){var Kt=B(U),Me=U&32767,De=z[Kt];if(V[Me]=De,z[Kt]=Me,we<=U){var xe=s-U;if((be>7e3||Ce>24576)&&(xe>423||!c)){u=Gl(t,p,0,se,ue,Se,Q,Ce,He,U-He,u),Ce=be=Q=0,He=U;for(var fe=0;fe<286;++fe)ue[fe]=0;for(var fe=0;fe<30;++fe)Se[fe]=0}var $e=2,Le=0,_n=A,Qe=Me-De&32767;if(xe>2&&Kt==B(U-Qe))for(var St=Math.min(y,xe)-1,Be=Math.min(32767,U),_e=Math.min(258,xe);Qe<=Be&&--_n&&Me!=De;){if(t[U+$e]==t[U+$e-Qe]){for(var ae=0;ae<_e&&t[U+ae]==t[U+ae-Qe];++ae);if(ae>$e){if($e=ae,Le=Qe,ae>St)break;for(var Re=Math.min(Qe,ae-2),Fe=0,fe=0;fe<Re;++fe){var Et=U-Qe+fe&32767,An=V[Et],sr=Et-An&32767;sr>Fe&&(Fe=sr,De=Et)}}}Me=De,De=V[Me],Qe+=Me-De&32767}if(Le){se[Ce++]=268435456|na[$e]<<18|Vl[Le];var Mn=na[$e]&31,cn=Vl[Le]&31;Q+=li[Mn]+ci[cn],++ue[257+Mn],++Se[cn],we=U+$e,++be}else se[Ce++]=t[U],++ue[t[U]]}}for(U=Math.max(U,we);U<s;++U)se[Ce++]=t[U],++ue[t[U]];u=Gl(t,p,c,se,ue,Se,Q,Ce,He,U-He,u),c||(o.r=u&7|p[u/8|0]<<3,u-=7,o.h=z,o.p=V,o.i=U,o.w=we)}else{for(var U=o.w||0;U<s+c;U+=65535){var un=U+65535;un>=s&&(p[u/8|0]=c,un=s),u=Ql(p,u+1,t.subarray(U,un))}o.i=s}return mo(a,0,r+la(u)+i)},Up=(function(){for(var t=new Int32Array(256),e=0;e<256;++e){for(var n=e,r=9;--r;)n=(n&1&&-306674912)^n>>>1;t[e]=n}return t})(),Gp=function(){var t=-1;return{p:function(e){for(var n=t,r=0;r<e.length;++r)n=Up[n&255^e[r]]^n>>>8;t=n},d:function(){return~t}}};var qp=function(t,e,n,r,i){if(!i&&(i={l:1},e.dictionary)){var o=e.dictionary.subarray(-32768),s=new Te(o.length+t.length);s.set(o),s.set(t,o.length),t=s,i.w=o.length}return Vp(t,e.level==null?6:e.level,e.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(t.length)))*1.5):20:12+e.mem,n,r,i)},tc=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n};var Zt=function(t,e){return t[e]|t[e+1]<<8},kt=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},ea=function(t,e){return kt(t,e)+kt(t,e+4)*4294967296},Ge=function(t,e,n){for(;n;++e)t[e]=n,n>>>=8};function Zp(t,e){return qp(t,e||{},0,0)}function Wp(t,e){return Fp(t,{i:2},e&&e.out,e&&e.dictionary)}var nc=function(t,e,n,r){for(var i in t){var o=t[i],s=e+i,a=r;Array.isArray(o)&&(a=tc(r,o[1]),o=o[0]),ArrayBuffer.isView(o)?n[s]=[o,a]:(n[s+="/"]=[new Te(0),a],nc(o,s,n,r))}},ql=typeof TextEncoder<"u"&&new TextEncoder,ia=typeof TextDecoder<"u"&&new TextDecoder,Yp=0;try{ia.decode(ec,{stream:!0}),Yp=1}catch{}var Kp=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:mo(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function Zl(t,e){if(e){for(var n=new Te(t.length),r=0;r<t.length;++r)n[r]=t.charCodeAt(r);return n}if(ql)return ql.encode(t);for(var i=t.length,o=new Te(t.length+(t.length>>1)),s=0,a=function(u){o[s++]=u},r=0;r<i;++r){if(s+5>o.length){var p=new Te(s+8+(i-r<<1));p.set(o),o=p}var c=t.charCodeAt(r);c<128||e?a(c):c<2048?(a(192|c>>6),a(128|c&63)):c>55295&&c<57344?(c=65536+(c&1047552)|t.charCodeAt(++r)&1023,a(240|c>>18),a(128|c>>12&63),a(128|c>>6&63),a(128|c&63)):(a(224|c>>12),a(128|c>>6&63),a(128|c&63))}return mo(o,0,s)}function Jp(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(ia)return ia.decode(t);var i=Kp(t),o=i.s,n=i.r;return n.length&&Xe(8),o}}var Xp=function(t,e){return e+30+Zt(t,e+26)+Zt(t,e+28)},Qp=function(t,e,n){var r=Zt(t,e+28),i=Zt(t,e+30),o=Jp(t.subarray(e+46,e+46+r),!(Zt(t,e+8)&2048)),s=e+46+r,a=em(t,s,i,n,kt(t,e+20),kt(t,e+24),kt(t,e+42)),p=a[0],c=a[1],u=a[2];return[Zt(t,e+10),p,c,o,s+i+Zt(t,e+32),u]},em=function(t,e,n,r,i,o,s){var a=i==4294967295,p=o==4294967295,c=s==4294967295,u=e+n,g=a+p+c;if(r&&g){for(;e+4<u;e+=4+Zt(t,e+2))if(Zt(t,e)==1)return[a?ea(t,e+4+8*p):i,p?ea(t,e+4):o,c?ea(t,e+4+8*(p+a)):s,1];r<2&&Xe(13)}return[i,o,s,0]},aa=function(t){var e=0;if(t)for(var n in t){var r=t[n].length;r>65535&&Xe(9),e+=r+4}return e},Wl=function(t,e,n,r,i,o,s,a){var p=r.length,c=n.extra,u=a&&a.length,g=aa(c);Ge(t,e,s!=null?33639248:67324752),e+=4,s!=null&&(t[e++]=20,t[e++]=n.os),t[e]=20,e+=2,t[e++]=n.flag<<1|(o<0&&8),t[e++]=i&&8,t[e++]=n.compression&255,t[e++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),A=y.getFullYear()-1980;if((A<0||A>119)&&Xe(10),Ge(t,e,A<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),e+=4,o!=-1&&(Ge(t,e,n.crc),Ge(t,e+4,o<0?-o-2:o),Ge(t,e+8,n.size)),Ge(t,e+12,p),Ge(t,e+14,g),e+=16,s!=null&&(Ge(t,e,u),Ge(t,e+6,n.attrs),Ge(t,e+10,s),e+=14),t.set(r,e),e+=p,g)for(var R in c){var V=c[R],z=V.length;Ge(t,e,+R),Ge(t,e+2,z),t.set(V,e+4),e+=4+z}return u&&(t.set(a,e),e+=u),e},tm=function(t,e,n,r,i){Ge(t,e,101010256),Ge(t,e+8,n),Ge(t,e+10,n),Ge(t,e+12,r),Ge(t,e+16,i)};function rc(t,e){e||(e={});var n={},r=[];nc(t,"",n,e);var i=0,o=0;for(var s in n){var a=n[s],p=a[0],c=a[1],u=c.level==0?0:8,g=Zl(s),y=g.length,A=c.comment,R=A&&Zl(A),V=R&&R.length,z=aa(c.extra);y>65535&&Xe(11);var X=u?Zp(p,c):p,I=X.length,B=Gp();B.p(p),r.push(tc(c,{size:p.length,crc:B.d(),c:X,f:g,m:R,u:y!=s.length||R&&A.length!=V,o:i,compression:u})),i+=30+y+z+I,o+=76+2*(y+z)+(V||0)+I}for(var se=new Te(o+22),ue=i,Se=o-i,be=0;be<r.length;++be){var g=r[be];Wl(se,g.o,g,g.f,g.u,g.c.length);var Q=30+g.f.length+aa(g.extra);se.set(g.c,g.o+Q),Wl(se,i,g,g.f,g.u,g.c.length,g.o,g.m),i+=16+Q+(g.m?g.m.length:0)}return tm(se,i,r.length,Se,ue),se}function oc(t,e){for(var n={},r=t.length-22;kt(t,r)!=101010256;--r)(!r||t.length-r>65558)&&Xe(13);var i=Zt(t,r+8);if(!i)return{};var o=kt(t,r+16),s=kt(t,r-20)==117853008;if(s){var a=kt(t,r-12);s=kt(t,a)==101075792,s&&(i=kt(t,a+32),o=kt(t,a+48))}for(var p=e&&e.filter,c=0;c<i;++c){var u=Qp(t,o,s),g=u[0],y=u[1],A=u[2],R=u[3],V=u[4],z=u[5],X=Xp(t,z);o=V,(!p||p({name:R,size:y,originalSize:A,compression:g}))&&(g?g==8?n[R]=Wp(t.subarray(X,X+y),{out:new Te(A)}):Xe(14,"unknown compression type "+g):n[R]=mo(t,X,X+y))}return n}function Ot(){return qt()}var Tt={get isSignedIn(){return qt().isSignedIn},get accessToken(){return qt().accessToken},get userName(){return qt().userName},get email(){return qt().email},set isSignedIn(t){let e=qt();Rt({...e,isSignedIn:t})},set accessToken(t){let e=qt();Rt({...e,accessToken:t})},set userName(t){let e=qt();Rt({...e,userName:t})},set email(t){let e=qt();Rt({...e,email:t})}};function vo(){return ze().auth.autoBackupEnabled}function Yt(){return ze().auth.autoBackupIntervalMinutes}var da=null,ve=null,pe=null,ar=null;function sc(t){da=t}function lc(t){ve=t}function cc(t){pe=t}function uc(t){ar=t}var ic=!1;function dc(){if(!ic)try{let t=document.createElement("style");t.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(t),ic=!0}catch{}}var pc=null,pa=null,fo=null,ho=null,ma=null;function mc(t){pc=t}function fc(t){pa=t}function fa(t){fo=t}function ha(t){ho=t}function hc(t){ma=t}var di="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",gc="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",vc="https://www.youtube.com/",nm=new Date(Date.UTC(2e3,0,1,0,0,0)),rm=30*1e3,om=1800*1e3,ac=5,ui=null,ot=null;async function ga(){try{let t=await ho("googleAuthState"),e=t&&typeof t=="object"?{...t,accessToken:t.accessToken?"[REDACTED]":null}:t;d("Loading Google auth state from IndexedDB:",e);let n=Ni.safeParse(t);if(n.success){let r=Ot();Rt({...r,...n.data});let i=Ot();i.isSignedIn&&i.accessToken&&d(`Reusing stored Google auth token for ${i.userName||i.email||"user"}`),zr();let o=Ot();o.isSignedIn&&o.accessToken&&await En(!0)}else if(t!==void 0){let r=t&&typeof t=="object"?{...t,accessToken:t.accessToken?"[REDACTED]":null}:t;d("Google auth state failed validation:",{stored:r,errors:n.error.format()},"warn")}}catch(t){d("Failed to load Google auth state:",t,"error")}}async function yo(){try{let t=Ot(),e=Ni.safeParse(t);if(!e.success){let n={...t,accessToken:t.accessToken?"[REDACTED]":null};d("Invalid auth state, cannot save",{state:n,errors:e.error.format()},"error");return}await fo("googleAuthState",t),t.isSignedIn&&t.accessToken?d(`Saved Google auth state to IndexedDB for ${t.userName||t.email||"user"}`):d("Cleared Google auth state in IndexedDB (signed out)")}catch(t){d("Failed to save Google auth state:",t,"error")}}function zr(){da&&(da.style.display="none")}function pt(t,e){if(!pe)return;if(pe.style.fontWeight="bold",t==="authenticating"){dc(),pe.style.color="#ffa500",pe.replaceChildren();let r=document.createElement("span");r.className="tk-auth-spinner";let i=document.createTextNode(` ${e||"Authorizing with Google\u2026"}`);pe.appendChild(r),pe.appendChild(i);return}if(t==="error"){ge(pe,"circle-x",e||"Authorization failed"),pe.style.color="#ff4d4f",Ae();return}let n=Ot();n.isSignedIn?(ge(pe,"circle-check","Signed in"),pe.style.color="#52c41a",pe.removeAttribute("title"),n.userName?(pe.onmouseenter=()=>{ge(pe,"circle-check",`Signed in as ${n.userName}`)},pe.onmouseleave=()=>{ge(pe,"circle-check","Signed in")}):(pe.onmouseenter=null,pe.onmouseleave=null)):(ge(pe,"circle-x","Not signed in"),pe.style.color="#ff4d4f",pe.removeAttribute("title"),pe.onmouseenter=null,pe.onmouseleave=null),Ae()}function im(){pe&&(dc(),pe.classList.remove("tk-auth-blink"),pe.offsetWidth,pe.classList.add("tk-auth-blink"),setTimeout(()=>{pe.classList.remove("tk-auth-blink")},1200))}function yc(t,e=300*1e3){return new Promise((n,r)=>{if(!t){d&&d("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}d&&d("OAuth monitor: starting to monitor popup for token");let i=Date.now(),o="timekeeper_oauth",s=null,a=null,p=null,c=()=>{if(s){try{s.close()}catch{}s=null}a&&(clearInterval(a),a=null),p&&(clearInterval(p),p=null)};try{s=new BroadcastChannel(o),d&&d("OAuth monitor: BroadcastChannel created successfully"),s.onmessage=y=>{let A=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;d&&d("OAuth monitor: received BroadcastChannel message",A);let R=q.object({type:q.string(),token:q.string().optional(),error:q.string().optional()}).safeParse(y.data);if(!R.success){d&&d("OAuth monitor: invalid message format",R.error,"warn");return}if(R.data.type==="timekeeper_oauth_token"&&R.data.token){d&&d("OAuth monitor: token received via BroadcastChannel"),c();try{t.close()}catch{}n(R.data.token)}else if(R.data.type==="timekeeper_oauth_error"){d&&d("OAuth monitor: error received via BroadcastChannel",R.data.error,"error"),c();try{t.close()}catch{}r(new Error(R.data.error||"OAuth failed"))}}}catch(y){d&&d("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}d&&d("OAuth monitor: setting up IndexedDB polling");let u=Date.now();a=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let A=y.result,z=A.transaction("settings","readonly").objectStore("settings").get("oauth_message");z.onsuccess=()=>{let X=z.result;if(X&&X.value){let I=X.value,B=q.object({type:q.string(),token:q.string().optional(),error:q.string().optional(),timestamp:q.number().optional()}).safeParse(I);if(!B.success){d&&d("OAuth monitor: invalid IndexedDB message format",B.error,"warn");return}if(B.data.timestamp&&B.data.timestamp>u){let se=B.data.token?{...B.data,token:"[REDACTED]"}:B.data;if(d&&d("OAuth monitor: received IndexedDB message",se),B.data.type==="timekeeper_oauth_token"&&B.data.token){d&&d("OAuth monitor: token received via IndexedDB"),c();try{t.close()}catch{}A.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(B.data.token)}else if(B.data.type==="timekeeper_oauth_error"){d&&d("OAuth monitor: error received via IndexedDB",B.data.error,"error"),c();try{t.close()}catch{}A.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(B.data.error||"OAuth failed"))}u=B.data.timestamp||Date.now()}}A.close()}}}catch(y){d&&d("OAuth monitor: IndexedDB polling error",y,"error")}},500),p=setInterval(()=>{if(Date.now()-i>e){d&&d("OAuth monitor: popup timed out after 5 minutes",null,"error"),c();try{t.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function bc(){if(!di){pt("error","Google Client ID not configured");return}try{d&&d("OAuth signin: starting OAuth flow"),pt("authenticating","Opening authentication window...");let t=new URL("https://accounts.google.com/o/oauth2/v2/auth");t.searchParams.set("client_id",di),t.searchParams.set("redirect_uri",vc),t.searchParams.set("response_type","token"),t.searchParams.set("scope",gc),t.searchParams.set("include_granted_scopes","true"),t.searchParams.set("state","timekeeper_auth"),d&&d("OAuth signin: opening popup");let e=window.open(t.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!e){d&&d("OAuth signin: popup blocked by browser",null,"error"),pt("error","Popup blocked. Please enable popups for YouTube.");return}d&&d("OAuth signin: popup opened successfully"),pt("authenticating","Waiting for authentication...");try{let n=await yc(e),r=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(r.ok){let i=await r.json(),o=q.object({name:q.string().optional(),email:q.string().optional()}).safeParse(i);if(!o.success)throw d&&d("Failed to validate user info response",o.error,"error"),new Error("Invalid user info response");let s=o.data;Rt({isSignedIn:!0,accessToken:n,userName:s.name||null,email:s.email||null}),await yo(),zr(),pt(),Ae(),await En(),d?d(`Successfully authenticated as ${s.name}`):console.log(`[Timekeeper] Successfully authenticated as ${s.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let r=n instanceof Error?n.message:"Authentication failed";d?d("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),pt("error",r);return}}catch(t){let e=t instanceof Error?t.message:"Sign in failed";d?d("Failed to sign in to Google:",t,"error"):console.error("[Timekeeper] Failed to sign in to Google:",t),pt("error",`Failed to sign in: ${e}`)}}async function am(){let t=Ot(),e=t.email;if(!di||!e)return!1;d("Silent OAuth: attempting silent token refresh for "+e);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",di),n.searchParams.set("redirect_uri",vc),n.searchParams.set("response_type","token"),n.searchParams.set("scope",gc),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",e);let r=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!r)return d("Silent OAuth: popup blocked",null,"warn"),!1;try{let i=await yc(r,15e3);return Rt({...t,isSignedIn:!0,accessToken:i}),await yo(),zr(),pt(),d("Silent OAuth: token refreshed successfully for "+e),!0}catch(i){d("Silent OAuth: silent refresh failed",i,"warn");try{r.close()}catch{}return!1}}async function wc(){if(!window.opener||window.opener===window)return!1;d&&d("OAuth popup: detected popup window, checking for OAuth response");let t=window.location.hash;if(!t||t.length<=1)return d&&d("OAuth popup: no hash params found"),!1;let e=t.startsWith("#")?t.substring(1):t,n=new URLSearchParams(e),r=n.get("state");if(d&&d("OAuth popup: hash params found, state="+r),r!=="timekeeper_auth")return d&&d("OAuth popup: not our OAuth flow (wrong state)"),!1;let i=n.get("error"),o=n.get("access_token"),s="timekeeper_oauth";if(i){try{let a=new BroadcastChannel(s);a.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||i}),a.close(),d&&d("OAuth popup: error broadcast via BroadcastChannel")}catch{let p={type:"timekeeper_oauth_error",error:n.get("error_description")||i,timestamp:Date.now()};d&&d("OAuth popup: writing error to IndexedDB",p);let c=indexedDB.open("ytls-timestamps-db",4);c.onsuccess=()=>{let u=c.result,y=u.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:p});y.onsuccess=()=>{d&&d("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{d&&d("OAuth popup: failed to write error to IndexedDB",y.error,"error")},u.close()},c.onerror=()=>{d&&d("OAuth popup: failed to open IndexedDB",c.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(o){d&&d("OAuth popup: access token found, broadcasting to opener");try{let a=new BroadcastChannel(s);a.postMessage({type:"timekeeper_oauth_token",token:o}),a.close(),d&&d("OAuth popup: token broadcast via BroadcastChannel")}catch(a){d&&d("OAuth popup: BroadcastChannel failed, using IndexedDB",a);let p={type:"timekeeper_oauth_token",token:o,timestamp:Date.now()},c={...p,token:"[REDACTED]"};d&&d("OAuth popup: writing token to IndexedDB",c);let u=indexedDB.open("ytls-timestamps-db",4);u.onsuccess=()=>{let g=u.result,A=g.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:p});A.onsuccess=()=>{d&&d("OAuth popup: token written to IndexedDB successfully")},A.onerror=()=>{d&&d("OAuth popup: failed to write token to IndexedDB",A.error,"error")},g.close()},u.onerror=()=>{d&&d("OAuth popup: failed to open IndexedDB",u.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function xc(){Rt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await yo(),await En(),zr(),pt(),Ae()}async function kc(){let t=Ot();if(!t.isSignedIn||!t.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${t.accessToken}`}});return e.status===401?(await Ec({silent:!0}),!1):e.ok}catch(e){return d("Failed to verify auth state:",e,"error"),!1}}function pi(){let t=Ot();return t.isSignedIn&&!!t.accessToken}function Nr(){return pi()}function sm(){let t=[];return pi()&&t.push("Google Drive"),t}function lm(t){let e=oc(new Uint8Array(t)),n=Object.values(e)[0];return n?new TextDecoder().decode(n):null}async function Tc(t){let e={Authorization:`Bearer ${t}`},r=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,i=await fetch(r,{headers:e});if(i.status===401)throw new Error("unauthorized");if(!i.ok)throw new Error("drive search failed");let o=await i.json();if(Array.isArray(o.files)&&o.files.length>0)return o.files[0].id;let s=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...e,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(s.status===401)throw new Error("unauthorized");if(!s.ok)throw new Error("drive folder create failed");return(await s.json()).id}async function Sc(t,e,n){let r=`name='${t}' and '${e}' in parents and trashed=false`,i=encodeURIComponent(r),o=await fetch(`https://www.googleapis.com/drive/v3/files?q=${i}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)return null;let s=await o.json();return s.files&&s.files.length>0?s.files[0].id:null}async function cm(t){try{let e=await Tc(t),n=await Sc("timekeeper-data.zip",e,t);if(!n)return null;let r=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${t}`}});if(r.status===401)throw new Error("unauthorized");return r.ok?lm(await r.arrayBuffer()):null}catch(e){if(e.message==="unauthorized")throw e;return d("Failed to fetch latest Drive backup for merge:",e,"warn"),null}}async function um(){if(!pa)return;let t=Ot();if(!t.isSignedIn||!t.accessToken)return;let e=await cm(t.accessToken).catch(async i=>i.message==="unauthorized"?(await Ec({silent:!0}),null):(d("Failed to fetch latest Drive backup for merge:",i,"warn"),null)),n=e?[e]:[],r=0;for(let i of n)if(i)try{let{mergedVideos:o,mergedTimestamps:s}=await pa(i);s>0&&(d(`Pre-backup merge: added ${s} timestamps from ${o} videos from remote`),r+=s)}catch(o){d("Failed to merge remote backup data:",o,"warn")}r>0&&ma&&ma()}function dm(t,e){let n=new TextEncoder().encode(t),r=e.replace(/\\/g,"/").replace(/^\/+/,"");return r.endsWith(".json")||(r+=".json"),rc({[r]:[n,{level:6,mtime:nm,os:0}]})}async function pm(t,e,n,r){let i=t.replace(/\.json$/,".zip"),o=await Sc(i,n,r),s=new TextEncoder().encode(e).length,a=dm(e,t),p=a.length;d(`Compressing data: ${s} bytes -> ${p} bytes (${Math.round(100-p/s*100)}% reduction)`);let c="-------314159265358979",u=`\r
--${c}\r
`,g=`\r
--${c}--`,y=o?{name:i,mimeType:"application/zip"}:{name:i,mimeType:"application/zip",parents:[n]},A=8192,R="";for(let se=0;se<a.length;se+=A){let ue=a.subarray(se,Math.min(se+A,a.length));R+=String.fromCharCode.apply(null,Array.from(ue))}let V=btoa(R),z=u+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+u+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+V+g,X,I;o?(X=`https://www.googleapis.com/upload/drive/v3/files/${o}?uploadType=multipart&fields=id,name`,I="PATCH"):(X="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",I="POST");let B=await fetch(X,{method:I,headers:{Authorization:`Bearer ${r}`,"Content-Type":`multipart/related; boundary=${c}`},body:z});if(B.status===401)throw new Error("unauthorized");if(!B.ok)throw new Error("drive upload failed")}async function Ec(t){d("Auth expired, attempting silent token refresh",null,"warn"),!await am()&&(d("Silent OAuth: falling back to sign-out",null,"warn"),Rt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await yo(),await En(),pt("error","Authorization expired. Please sign in again."),Ae())}async function mm(t){if(!pi())throw t?.silent||pt("error","Configure a backup destination first"),new Error("no-backup-destination");await um();let e=await pc({includeDeleted:!0});if(e.totalTimestamps===0){t?.silent||d("Skipping export: no timestamps to back up");return}let n=Ot();if(!n.accessToken)throw new Error("unauthorized");let r=await Tc(n.accessToken);await pm(e.filename,e.json,r,n.accessToken),d(`Exported backup to Google Drive (${e.filename}) with ${e.totalVideos} videos / ${e.totalTimestamps} timestamps.`)}async function _c(){try{let[t,e,n]=await Promise.all([ho("lastAutoBackupAt"),ho("autoBackupEnabled"),ho("autoBackupIntervalMinutes")]),r=zi.partial().safeParse({autoBackupEnabled:e,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof t=="number"&&t>0?t:null});r.success?(typeof r.data.autoBackupEnabled=="boolean"&&Gi(r.data.autoBackupEnabled),typeof r.data.autoBackupIntervalMinutes=="number"&&qi(r.data.autoBackupIntervalMinutes),typeof r.data.lastAutoBackupAt=="number"&&Wi(r.data.lastAutoBackupAt)):d("Failed to validate auto backup settings:",r.error.format(),"warn")}catch(t){d("Failed to load auto backup settings:",t,"error")}}async function va(){try{let t=ze().auth,e={autoBackupEnabled:t.autoBackupEnabled,autoBackupIntervalMinutes:t.autoBackupIntervalMinutes,lastAutoBackupAt:t.lastAutoBackupAt},n=zi.safeParse(e);if(!n.success){d("Invalid auto backup settings, cannot save",{settings:e,errors:n.error.format()},"error");return}await Promise.all([fo("autoBackupEnabled",t.autoBackupEnabled),fo("autoBackupIntervalMinutes",t.autoBackupIntervalMinutes),fo("lastAutoBackupAt",t.lastAutoBackupAt)])}catch(t){d("Failed to save auto backup settings:",t,"error")}}function fm(){ui&&(clearInterval(ui),ui=null),ot&&(clearTimeout(ot),ot=null)}function ir(t){try{let e=new Date(t),n=new Date,r=e.toDateString()===n.toDateString(),i=e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r?i:`${e.toLocaleDateString()} ${i}`}catch{return""}}function ca(){let t=sm();return t.length>0?`Destinations: ${t.join(", ")}`:"No backup destination configured"}function Ac(){let t=ze().auth;return t.autoBackupEnabled?t.isAutoBackupRunning?"#4285f4":t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0?"#ffa500":Nr()&&t.lastAutoBackupAt?"#52c41a":Nr()?"#ffa500":"#ff4d4f":"#ff4d4f"}function Ae(){if(ya(),!ve)return;let t=ze().auth;if(!t.autoBackupEnabled)ge(ve,"refresh","Backup: Off"),ve.onmouseenter=null,ve.onmouseleave=null;else if(t.isAutoBackupRunning)ge(ve,"refresh","Backing up\u2026"),ve.onmouseenter=null,ve.onmouseleave=null;else if(t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0){let n=Math.ceil(t.autoBackupBackoffMs/6e4);ge(ve,"alert-triangle",`Retry in ${n}m`),ve.onmouseenter=null,ve.onmouseleave=null}else if(!Nr())ge(ve,"alert-triangle","Backup target missing"),ve.onmouseenter=null,ve.onmouseleave=null;else if(t.lastAutoBackupAt){let n=t.lastAutoBackupAt,r=n+Math.max(1,Yt())*60*1e3,i=ir(r);ve.onmouseenter=()=>{ge(ve,"database",`Next backup: ${i}`)},ve.onmouseleave=()=>{ge(ve,"database",`Last backup: ${ir(n)}`)},ge(ve,"database",`Last backup: ${ir(n)}`)}else{let n=Date.now()+Math.max(1,Yt())*60*1e3,r=ir(n);ve.onmouseenter=()=>{ge(ve,"database",`Next backup: ${r}`)},ve.onmouseleave=()=>{ge(ve,"database","Last backup: never")},ge(ve,"database","Last backup: never")}ve.style.display="inline";let e=Ac();ve.style.color=e}var ua="ytls-backup-indicator--pulsing",hm="#4285f4",Or=null;function gm(t,e){Or&&(t.removeEventListener("animationiteration",Or),Or=null),e===hm?(t.style.backgroundColor=e,t.classList.add(ua)):t.classList.contains(ua)?(Or=()=>{ar&&(ar.classList.remove(ua),ar.style.backgroundColor=e,Or=null)},t.addEventListener("animationiteration",Or,{once:!0})):t.style.backgroundColor=e}function ya(){if(!ar)return;let t=Ac();gm(ar,t),dt(ar,()=>{let e=ze().auth,n="";if(!e.autoBackupEnabled)n="Auto backup is disabled";else if(e.isAutoBackupRunning)n="Backup in progress";else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0)n=`Retrying backup in ${Math.ceil(e.autoBackupBackoffMs/6e4)}m`;else if(!Nr())n=ca();else if(e.lastAutoBackupAt){let r=e.lastAutoBackupAt+Math.max(1,Yt())*60*1e3,i=ir(r);n=`Last backup: ${ir(e.lastAutoBackupAt)}
Next backup: ${i}
${ca()}`}else{let r=Date.now()+Math.max(1,Yt())*60*1e3;n=`No backup yet
Next backup: ${ir(r)}
${ca()}`}return n})}async function go(t={}){let{silent:e=!0,skipBackoff:n=!1}=t;if(!Nr()){e||(Ae(),pi()||im());return}if(ot){if(!n){d("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(ot),ot=null,Pr(null),d("Auto backup: manual run cleared backoff and will proceed immediately")}if(!ze().auth.isAutoBackupRunning){Zi(!0),Ae();try{await mm({silent:e}),Wi(Date.now()),si(0),Pr(null),ot&&(clearTimeout(ot),ot=null),await va()}catch(r){if(d("Auto backup failed:",r,"error"),r.message==="unauthorized"){d("Auth error detected, clearing token and stopping retries",null,"warn");let o=Ot();Rt({...o,accessToken:null,isSignedIn:!1}),await yo(),pt("error","Authorization expired. Please sign in again."),Ae(),si(0),Pr(null),ot&&(clearTimeout(ot),ot=null)}else if(ze().auth.autoBackupRetryAttempts<ac){let o=ze().auth.autoBackupRetryAttempts+1;si(o);let a=Math.min(rm*Math.pow(2,o-1),om);Pr(a),ot&&clearTimeout(ot),ot=setTimeout(()=>{go({silent:!0})},a),d(`Scheduling backup retry ${o}/${ac} in ${Math.round(a/1e3)}s`),Ae()}else Pr(null)}finally{Zi(!1),Ae()}}}async function En(t=!1){if(fm(),!!vo()&&Nr()){if(ui=setInterval(()=>{go({silent:!0})},Math.max(1,Yt())*60*1e3),!t){let e=Date.now(),n=Math.max(1,Yt())*60*1e3,r=ze().auth.lastAutoBackupAt;(!r||e-r>=n)&&go({silent:!0})}Ae()}}async function Mc(){let t=vo();Gi(!t),await va(),await En(),Ae()}async function Lc(){let t=Yt(),e=prompt("Set Auto Backup interval (minutes):",String(t));if(e===null)return;let n=Math.floor(Number(e));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}qi(n),await va(),await En(),Ae()}function ba(t,e){return ri(t).then(n=>n!==void 0?n:e)}function wa(t,e){return ni(t,e),Promise.resolve()}var xa=window.location.hash;if(xa&&xa.length>1){let t=new URLSearchParams(xa.substring(1));if(t.get("state")==="timekeeper_auth"){let n=t.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let r=new BroadcastChannel("timekeeper_oauth"),i={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:i.type,tokenLength:n.length}),r.postMessage(i),r.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(r){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",r);let i={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},o=indexedDB.open("ytls-timestamps-db",4);o.onsuccess=()=>{let s=o.result,a=s.transaction("settings","readwrite");a.objectStore("settings").put({key:"oauth_message",value:i}),a.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",i.timestamp),s.close()}}}if(history.replaceState){let r=window.location.pathname+window.location.search;history.replaceState(null,"",r)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}jl();(async function(){"use strict";if(window.top!==window.self)return;function t(l){return ba(l,void 0)}function e(l,m){return wa(l,m)}ha(t),fa(e);try{let l=await ri("device_id"),m=typeof l=="string"&&l.length>0?l:crypto.randomUUID();await ni("device_id",m),d(`Lamport: device_id = ${m}`)}catch(l){d("Lamport: failed to initialize device_id:",l,"warn")}if(await wc()){d("OAuth popup detected, broadcasting token and closing");return}await ga();let r=["/watch","/live"];function i(l=window.location.href){try{let m=new URL(l);return m.origin!=="https://www.youtube.com"?!1:r.some(f=>m.pathname===f||m.pathname.startsWith(`${f}/`))}catch(m){return d("Timekeeper failed to parse URL for support check:",m,"error"),!1}}let o=null,s=null,a=null,p=null,c=null,u=null,g=(()=>{try{let l=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(l)&&l>0&&l!==1?Math.min(l,4):2}catch{return 2}})(),y=!1,A=null,R=null,V=250,z=null,X=!1;function I(){return ze().ui.minPaneHeight}function B(l){Ml(l)}function se(){return ze().ui.lastHandledUrl}function ue(l){Il(l)}function Se(){return ze().ui.urlChangeHandlersSetup}function be(l){Cl(l)}function Q(){return ze().ui.panePosition}function U(l){Ll(l)}function Ce(){return ze().timestamps.items}function we(l){Dl(l)}function He(){return ze().timestamps.currentIndex}function Kt(l){Bl(l)}function Me(){return o?o.getBoundingClientRect():null}function De(l,m,f){l&&U({x:Math.round(typeof m=="number"?m:l.left),y:Math.round(typeof f=="number"?f:l.top),width:Math.round(l.width),height:Math.round(l.height)})}function xe(l=!0){if(!o)return;pr();let m=Me();if(m&&(m.width||m.height)&&(De(m),l)){let f=Q();Oo("windowPosition",f),$r({type:"window_position_updated",position:f,timestamp:Date.now()})}}function fe(){if(!o||!s||!p||!a)return;let l=40,m=Oe();if(m.length>0)l=m[0].offsetHeight;else{let f=document.createElement("li");f.style.visibility="hidden",f.style.position="absolute",f.textContent="00:00 Example",a.appendChild(f),l=f.offsetHeight,a.removeChild(f)}V=s.offsetHeight+p.offsetHeight+l,B(V),o.style.minHeight=I()+"px"}function $e(){requestAnimationFrame(()=>{je?.(),fe(),xe(!0)})}function Le(l=450){Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{Be(),$e(),Ie=null},l)}function _n(){Ie&&(clearTimeout(Ie),Ie=null)}function Qe(){a&&(a.style.visibility="hidden",d("Hiding timestamps during show animation")),$e(),Le()}function St(){Be(),_n(),_t&&(clearTimeout(_t),_t=null),_t=setTimeout(()=>{o&&(o.style.display="none",Ga(),_t=null)},400)}function Be(){if(!a){mt&&(mt(),mt=null,Jt=null,Dn=null);return}if(!Dn){a.style.visibility==="hidden"&&(a.style.visibility="",d("Restoring timestamp visibility (no deferred fragment)")),mt&&(mt(),mt=null,Jt=null);return}d("Appending deferred timestamps after animation"),a.appendChild(Dn),Dn=null,mn(),fn(),a.style.visibility==="hidden"&&(a.style.visibility="",d("Restoring timestamp visibility after append")),mt&&(mt(),mt=null,Jt=null),Ct(),et(),je&&requestAnimationFrame(je),Dt(!0)}let _e=null,ae=!1,Re="ytls-timestamp-pending-delete",Fe="ytls-timestamp-highlight",Et="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",An="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function sr(){let l=m=>{let f=new Image;f.src=m};l(Et),l(An)}sr();async function Mn(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(l=>setTimeout(l,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(l=>setTimeout(l,100));await new Promise(l=>setTimeout(l,200))}let cn=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],un=5e3,Hr=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function ka(l){return Hr.has(l)}function gt(){return document.querySelector("video")}let Ln=null;function ye(){if(Ln&&document.contains(Ln))return Ln;let l=document.getElementById("movie_player");return l&&document.contains(l)?l:null}function Ta(l){return(Math.round(l*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function Ic(l){let m=l===1?2:l;g=m;try{localStorage.setItem("ytls-last-speed",String(m))}catch{}}function mi(l){if(!u)return;let m=typeof l=="number"?l:gt()?.playbackRate??1,f=Ta(m);u.textContent=`${f}x`,u.setAttribute("aria-label",`Playback speed ${f}x`),Math.abs(m-1)>.01?u.classList.add("ytls-playback-speed-active"):u.classList.remove("ytls-playback-speed-active")}function Cc(l){let m=ye(),f=gt();if(y=!0,m&&typeof m.setPlaybackRate=="function")m.setPlaybackRate(l);else if(f)f.playbackRate=l;else return y=!1,!1;return mi(l),!0}function Sa(){let l=gt()?.playbackRate;return Number.isFinite(l)?Cc(Math.abs(l-1)<=.001?g:1):!1}function Dc(l){return l instanceof Element?!!l.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function fi(l){return cn.every(m=>typeof l?.[m]=="function"?!0:ka(m)?!!gt():!1)}function Bc(l){return cn.filter(m=>typeof l?.[m]=="function"?!1:ka(m)?!gt():!0)}async function Rc(l=un){let m=Date.now();for(;Date.now()-m<l;){let b=ye();if(fi(b))return b;await new Promise(T=>setTimeout(T,100))}let f=ye();return fi(f),f}let Ea="timestampOffsetSeconds",Pc=-5,_a="shiftClickTimeSkipSeconds",Oc=10,hi=300,gi=300,Nt=null;function Aa(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ma(){if(Aa()&&!Nt)try{Nt=new BroadcastChannel("ytls_timestamp_channel"),Nt.onmessage=La}catch(l){d("Failed to create BroadcastChannel:",l,"warn"),Nt=null}}function $r(l){if(!Aa()){d("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ma(),!Nt){d("No BroadcastChannel available to post message","warn");return}try{Nt.postMessage(l)}catch(m){d("BroadcastChannel error, reopening:",m,"warn");try{Nt=new BroadcastChannel("ytls_timestamp_channel"),Nt.onmessage=La,Nt.postMessage(l)}catch(f){d("Failed to reopen BroadcastChannel:",f,"error")}}}function La(l){if(d("Received message from another tab:",l.data),!(!i()||!a||!o)&&l.data){if(l.data.type==="timestamps_updated"&&l.data.videoId===Pe)d("Debouncing timestamp load due to external update for video:",l.data.videoId),clearTimeout(jr),jr=setTimeout(()=>{d("Reloading timestamps due to external update for video:",l.data.videoId),Ti()},500);else if(l.data.type==="window_position_updated"&&o){let m=l.data.position;if(m&&typeof m.x=="number"&&typeof m.y=="number"){o.style.left=`${m.x}px`,o.style.top=`${m.y}px`,o.style.right="auto",o.style.bottom="auto",typeof m.width=="number"&&m.width>0&&(o.style.width=`${m.width}px`),typeof m.height=="number"&&m.height>0&&(o.style.height=`${m.height}px`);let f=o.getBoundingClientRect();U({x:Math.round(m.x),y:Math.round(m.y),width:Math.round(f.width),height:Math.round(f.height)});let b=document.documentElement.clientWidth,T=document.documentElement.clientHeight;(f.left<0||f.top<0||f.right>b||f.bottom>T)&&pr()}}}}Ma();let lr=await ba(Ea);(typeof lr!="number"||Number.isNaN(lr))&&(lr=Pc,await wa(Ea,lr));let Fr=await ba(_a);(typeof Fr!="number"||Number.isNaN(Fr))&&(Fr=Oc,await wa(_a,Fr));let jr=null,In=new Map,Cn=!1,Z=null,bo=null,Pe=null,_t=null,Ie=null,At=null,it=null,dn=null,vi=!1,je=null,Dn=null,Jt=null,mt=null,pn=null,wo=!1,ym=null,yi=!1,xo=null,ko=null,To=null,So=null,Eo=null,_o=null,Ao=null,Mo=null,Vr=null,Ur=null,Gr=null,Mt=null,Lt=null,Ia=0,qr=!1,Bn=null,Zr=null,cr=null,Ca=null,Wr=null;function Rn(){if(!a)return{items:[],starts:[],rawTimes:[]};if(Ca!==a||!Wr?(Wr?.disconnect(),Wr=new MutationObserver(()=>{cr=null}),Wr.observe(a,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),Ca=a,cr=null):Wr.takeRecords().length>0&&(cr=null),!cr){let l=oi(a),m=new Array(l.length),f=new Array(l.length);for(let b=0;b<l.length;b++){let T=l[b].querySelector("[data-time]")?.dataset.time;m[b]=T?Number.parseInt(T,10):NaN,f[b]=T?parseFloat(T):0}cr={items:l,starts:m,rawTimes:f}}return cr}function Oe(){return Rn().items}function bi(){return El(a)}function It(){return Zr!==null||(Zr=_l(a)),Zr}function mn(){Zr=null}function Nc(l){let m=l.querySelector(".time-diff");return m?(m.textContent?.trim()||"").startsWith("-"):!1}let zc="\u251C\u2500 ",Da="\u2514\u2500 ",Ba=/^[├└]─\s/;function Lo(l){return Ba.test(l)}function Ra(l){return l.replace(Ba,"")}function Pa(l){let m=Oe();if(l>=m.length-1)return Da;let T=m[l+1].querySelector("input");return T&&Lo(T.value)?zc:Da}function Hc(l,m){return`${Pa(m)}${l}`}function Ct(){if(!a)return;Oe().forEach((m,f)=>{let b=m.querySelector("input");if(!b||!Lo(b.value))return;let T=Ra(b.value),S=Hc(T,f);b.value!==S&&(b.value=S)})}function Yr(){ii(a),Dn&&(Dn=null),mt&&(mt(),mt=null,Jt=null)}function Kr(){Sl(a,ae)}function Oa(l){Ui(a,l)}function wi(){xl(a)}function xi(l){if(!(!o||!a)){if(ae=l,l)o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),Oa("Loading timestamps...");else if(wi(),o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),c){let m=ye();if(m){let f=m.getCurrentTime(),b=Number.isFinite(f)?Math.max(0,Math.floor(f)):Math.max(0,It()),{isLive:T}=m.getVideoData()||{isLive:!1},S=a?Rn().rawTimes:[],x="";if(S.length>0)if(T){let _=Math.max(1,b/60),N=S.filter(D=>D<=b);if(N.length>0){let D=(N.length/_).toFixed(2);parseFloat(D)>0&&(x=` (${D}/min)`)}}else{let _=m.getDuration(),N=Number.isFinite(_)&&_>0?_:0,D=Math.max(1,N/60),O=(S.length/D).toFixed(1);parseFloat(O)>0&&(x=` (${O}/min)`)}c.textContent=`${Vt(b)}${x}`}}!ae&&a&&!ao(a)&&Kr(),Xt()}}function bm(l){return l?Cr.safeParse(l).success:!1}function Io(l,m){l.dataset.time=String(m),l.textContent=Vt(m,It())}let Co=null,Do=null,zt=!1;function Na(l){if(!l||typeof l.getVideoData!="function"||!l.getVideoData()?.isLive)return!1;if(typeof l.getProgressState=="function"){let f=l.getProgressState(),b=Number(f?.seekableEnd??f?.liveHead??f?.head??f?.duration),T=Number(f?.current??l.getCurrentTime?.());if(Number.isFinite(b)&&Number.isFinite(T))return b-T>2}return!1}function $c(l,m){if(!Number.isFinite(l))return;let f=za(l);ki(f,m)}function Dt(l=!1,m){if(Cn&&!l)return;let f;if(typeof m=="number"&&Number.isFinite(m))f=Math.max(0,Math.floor(m));else{let b=ye(),T=b?b.getCurrentTime():NaN;f=Number.isFinite(T)?Math.max(0,Math.floor(T)):Math.max(0,It())}Number.isFinite(f)&&$c(f,l)}function za(l){if(!Number.isFinite(l))return null;let{items:m,starts:f}=Rn(),b=-1,T=-1/0;for(let S=0;S<f.length;S++){let x=f[S];x<=l&&x>T&&(T=x,b=S)}return b>=0?m[b]:null}function ki(l,m=!1){let f=a?a.getElementsByClassName(Fe):null;if(!(!!f&&(l?f.length===1&&f[0]===l:f.length===0))&&f)for(let T of Array.from(f))T.classList.contains(Re)||T.classList.remove(Fe);if(l&&!l.classList.contains(Re)&&(l.classList.add(Fe),m))try{if(a instanceof HTMLElement){let T=l.getBoundingClientRect(),S=a.getBoundingClientRect();!(T.bottom<S.top||T.top>S.bottom)||l.scrollIntoView({behavior:"smooth",block:"center"})}else l.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{l.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Fc(l){if(Ht()||!Number.isFinite(l)||l===0)return!1;let m=Oe();if(m.length===0)return!1;let f=!1;return m.forEach(b=>{let T=b.querySelector("[data-time]"),S=T?.dataset.time;if(!T||!S)return;let x=Number.parseInt(S,10);if(!Number.isFinite(x))return;let _=Math.max(0,x+l);_!==x&&(Io(T,_),f=!0)}),f?(fn(),Ct(),et(),Ro(Pe),Bn=null,!0):!1}function Ha(l,m={}){if(!Number.isFinite(l)||l===0)return!1;if(!Fc(l)){if(m.alertOnNoChange){let x=m.failureMessage??"Offset did not change any timestamps.";alert(x)}return!1}let b=m.logLabel??"bulk offset";d(`Timestamps changed: Offset all timestamps by ${l>0?"+":""}${l} seconds (${b})`);let T=ye(),S=T?Math.floor(T.getCurrentTime()):0;if(Number.isFinite(S)){let x=za(S);ki(x,!1)}return!0}function $a(l){if(!a||ae)return;let m=l.target instanceof Element?l.target:null;if(!m)return;let f=m.closest("[data-time]"),b=m.closest("[data-increment]"),T=m.closest("[data-action]");if(f?.dataset.time){l.preventDefault();let S=Number(f.dataset.time);if(Number.isFinite(S)){d(`Seeking to timestamp ${S}`),zt=!0;let _=ye();_&&_.seekTo(S),setTimeout(()=>{zt=!1},500)}let x=f.closest("li");x&&(Oe().forEach(_=>{_.classList.contains(Re)||_.classList.remove(Fe)}),x.classList.contains(Re)||(x.classList.add(Fe),x.scrollIntoView({behavior:"smooth",block:"center"})))}else if(b?.dataset.increment){l.preventDefault();let S=b.closest("li"),x=S?.querySelector("[data-time]");if(!x||!x.dataset.time)return;let _=parseInt(x.dataset.time,10),N=parseInt(b.dataset.increment,10);if("shiftKey"in l&&l.shiftKey&&(N*=Fr),"altKey"in l?l.altKey:!1){Ha(N,{logLabel:"Alt adjust"});return}let G=Math.max(0,_+N);if(d(`Timestamps changed: Timestamp time incremented from ${_} to ${G}`),mn(),Io(x,G),Do=G,Co&&clearTimeout(Co),zt=!0,Co=setTimeout(()=>{if(Do!==null){let ie=ye();ie&&ie.seekTo(Do)}Co=null,Do=null,setTimeout(()=>{zt=!1},500)},500),fn(),Ct(),et(),S){let ie=S.querySelector("input"),ke=S.dataset.guid;ie&&ke&&(ur(Pe,ke,G,ie.value),Bn=ke)}}else T?.dataset.action==="clear"&&(l.preventDefault(),d("Timestamps changed: All timestamps cleared from UI"),a.textContent="",mn(),et(),Bo(),Ro(Pe,{allowEmpty:!0}),Bn=null,Kr())}function Jr(l,m="",f=!1,b=null,T=!0){if(!a)return null;let S=Math.max(0,l),x=b??crypto.randomUUID(),_=document.createElement("li"),N=document.createElement("div"),D=document.createElement("span"),O=document.createElement("span"),G=document.createElement("span"),ie=document.createElement("div"),ke=document.createElement("span"),at=document.createElement("span"),oe=document.createElement("input"),Ne=document.createElement("button");_.dataset.guid=x,N.className="time-row",ie.className="ytls-row-controls";let tt=document.createElement("div");tt.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",dt(tt,"Click to toggle indent");let nt=document.createElement("span");nt.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let hn=()=>{let ee=oe.offsetTop,te=oe.offsetHeight||20;tt.style.top=`${ee}px`,tt.style.height=`${te}px`},Pn=()=>{We(nt,Lo(oe.value)?"indent-decrease":"indent-increase",18)},mr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",gn=ee=>{let te=nt.querySelector("svg");te&&(te.style.transition="filter 0.15s ease",te.style.filter=ee?mr:"none")},fr=ee=>{ee.stopPropagation();let te=Lo(oe.value),me=Ra(oe.value),ce="";if(!te){let vt=Oe().indexOf(_);ce=Pa(vt)}oe.value=ce?`${ce}${me}`:me,Pn(),Ct();let Ee=Number.parseInt(ke.dataset.time??"0",10);ur(Pe,x,Ee,oe.value)};tt.onclick=fr,tt.append(nt),tt.addEventListener("mouseenter",()=>{gn(!0)}),tt.addEventListener("mouseleave",()=>{gn(!1)}),_.style.cssText="position:relative;padding-left:20px;",_.addEventListener("mouseenter",()=>{hn(),Pn(),nt.style.display="inline"}),_.addEventListener("mouseleave",()=>{gn(!1),nt.style.display="none"}),_.addEventListener("mouseleave",()=>{_.dataset.guid===Bn&&Nc(_)&&Fa()}),oe.value=m||"",oe.style.cssText="width:100%;margin-top:5px;display:block;",oe.type="text",oe.setAttribute("inputmode","text"),oe.autocapitalize="off",oe.autocomplete="off",oe.spellcheck=!1,requestAnimationFrame(hn);let Xr=!1;oe.addEventListener("focusin",()=>{qr=!1,Xr=!1}),oe.addEventListener("focusout",ee=>{let te=ee.relatedTarget,me=Date.now()-Ia<250,ce=!!te&&!!o&&o.contains(te);!me&&!ce&&!Xr&&(qr=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(oe.focus({preventScroll:!0}),qr=!1)},0))}),oe.addEventListener("keydown",ee=>{(ee.key==="Escape"||ee.key==="Esc")&&(ee.preventDefault(),Xr=!0,oe.blur())}),oe.addEventListener("input",ee=>{let te=ee;if(te&&(te.isComposing||te.inputType==="insertCompositionText"))return;let me=In.get(x);me&&clearTimeout(me);let ce=setTimeout(()=>{let Ee=Number.parseInt(ke.dataset.time??"0",10);ur(Pe,x,Ee,oe.value),In.delete(x)},500);In.set(x,ce)}),oe.addEventListener("compositionend",()=>{let ee=Number.parseInt(ke.dataset.time??"0",10);setTimeout(()=>{ur(Pe,x,ee,oe.value)},50)});let No="#f4ba78",Qt="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",zo="#c8452d",Ho="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",On=(ee,te=No,me=Qt)=>{ee.style.color=te;let ce=ee.querySelector("svg");ce&&(ce.style.transition="filter 0.15s ease"),ee.addEventListener("mouseenter",()=>{ce&&(ce.style.filter=me)}),ee.addEventListener("mouseleave",()=>{ce&&(ce.style.filter="none")})};We(D,"circle-minus",18),D.classList.add("ytls-row-control"),D.dataset.increment="-1",D.style.cursor="pointer",D.style.margin="0px",On(D),We(G,"circle-plus",18),G.classList.add("ytls-row-control"),G.dataset.increment="1",G.style.cursor="pointer",G.style.margin="0px",On(G),We(O,"current-location",18),O.classList.add("ytls-row-control"),O.style.cursor="pointer",O.style.margin="0px",dt(O,"Set to current playback time"),On(O),O.onclick=()=>{let ee=ye(),te=ee?Math.floor(ee.getCurrentTime()):0;Number.isFinite(te)&&(d(`Timestamps changed: set to current playback time ${te}`),mn(),Io(ke,te),fn(),Ct(),ur(Pe,x,te,oe.value),Bn=x)},mn(),Io(ke,S),ke.addEventListener("click",ee=>{ee.preventDefault(),ee.stopPropagation();let te=Number(ke.dataset.time);if(!Number.isFinite(te))return;d(`Seeking to timestamp ${te}`),zt=!0;let me=ye();me&&me.seekTo(te);let ce=gt();ce?.paused&&ce.play(),setTimeout(()=>{zt=!1},500),a?.querySelectorAll(`.${Fe}`).forEach(Ee=>Ee.classList.remove(Fe)),_.classList.contains(Re)||(_.classList.add(Fe),_.scrollIntoView({behavior:"smooth",block:"center"}))}),We(Ne,"trash",16),Ne.classList.add("ytls-row-control"),Ne.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",On(Ne,zo,Ho),Ne.onclick=()=>{let ee=null,te=null,me=null,ce=()=>{try{_.removeEventListener("click",te,!0)}catch{}try{document.removeEventListener("click",te,!0)}catch{}if(a)try{a.removeEventListener("mouseleave",me)}catch{}ee&&(clearTimeout(ee),ee=null)};if(_.dataset.deleteConfirmed==="true"){d("Timestamps changed: Timestamp deleted");let Ee=_.dataset.guid??"",rt=In.get(Ee);rt&&(clearTimeout(rt),In.delete(Ee)),ce(),_.remove(),mn(),fn(),Ct(),et(),Bo(),Vc(Pe,Ee),Bn=null,Kr()}else{_.dataset.deleteConfirmed="true",_.classList.add(Re),_.classList.remove(Fe);let Ee=()=>{_.dataset.deleteConfirmed="false",_.classList.remove(Re);let rt=ye(),vt=rt?rt.getCurrentTime():0,hr=Number.parseInt(_.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(vt)&&Number.isFinite(hr)&&vt>=hr&&_.classList.add(Fe),ce()};te=rt=>{rt.target!==Ne&&Ee()},me=()=>{_.dataset.deleteConfirmed==="true"&&Ee()},_.addEventListener("click",te,!0),document.addEventListener("click",te,!0),a&&a.addEventListener("mouseleave",me),ee=setTimeout(()=>{_.dataset.deleteConfirmed==="true"&&Ee(),ce()},5e3)}},at.className="time-diff",at.style.color="#888",at.style.marginLeft="5px",ie.append(D,O,G,Ne),N.append(ke,ie,at),_.append(tt,N,oe);let $o=Number.parseInt(ke.dataset.time??"0",10);if(T){wi();let ee=!1,te=Oe();for(let me=0;me<te.length;me++){let ce=te[me],rt=ce.querySelector("[data-time]")?.dataset.time;if(!rt)continue;let vt=Number.parseInt(rt,10);if(Number.isFinite(vt)&&$o<vt){a.insertBefore(_,ce),ee=!0;break}}ee||a.appendChild(_),_.scrollIntoView({behavior:"smooth",block:"center"}),mn(),fn(),Bo(),Ct(),et(),f||(ur(Pe,x,S,m),Bn=x,ki(_,!1))}else oe.__ytls_li=_;return oe}function fn(){if(Ht())return;let l=It(),m=Oe();m.forEach((f,b)=>{let T=f.querySelector(".time-diff"),S=f.querySelector("[data-time]"),x=S?.dataset.time;if(S&&x){let at=Number.parseInt(x,10);Number.isFinite(at)&&(S.textContent=Vt(at,l))}if(!T)return;if(!x){T.textContent="";return}let _=Number.parseInt(x,10);if(!Number.isFinite(_)){T.textContent="";return}if(b===0){T.textContent="";return}let O=m[b-1].querySelector("[data-time]")?.dataset.time;if(!O){T.textContent="";return}let G=Number.parseInt(O,10);if(!Number.isFinite(G)){T.textContent="";return}let ie=_-G,ke=ie<0?"-":"";T.textContent=` ${ke}${Vt(Math.abs(ie))}`})}function Fa(){if(Ht())return;let l=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)){let x=document.activeElement,N=x.closest("li")?.dataset.guid;if(N){let D=x.selectionStart??x.value.length,O=x.selectionEnd??D,G=x.scrollLeft;l={guid:N,start:D,end:O,scroll:G}}}let m=Oe();if(m.length===0)return;let f=m.map(x=>x.dataset.guid),b=m.map(x=>{let _=x.querySelector("[data-time]"),N=_?.dataset.time;if(!_||!N)return null;let D=Number.parseInt(N,10);if(!Number.isFinite(D))return null;let O=x.dataset.guid??"";return{time:D,guid:O,element:x}}).filter(x=>x!==null).sort((x,_)=>{let N=x.time-_.time;return N!==0?N:x.guid.localeCompare(_.guid)}),T=b.map(x=>x.guid),S=f.length!==T.length||f.some((x,_)=>x!==T[_]);if(a.replaceChildren(),b.forEach(x=>{a.appendChild(x.element)}),fn(),Ct(),et(),l){let _=Oe().find(N=>N.dataset.guid===l.guid)?.querySelector("input");if(_)try{_.focus({preventScroll:!0})}catch{}}S&&(d("Timestamps changed: Timestamps sorted"),Ro(Pe))}function Bo(){if(!a||!o||!s||!p)return;let l=Oe().length;je?.();let m=o.getBoundingClientRect(),f=s.getBoundingClientRect(),b=p.getBoundingClientRect(),T=Math.max(0,m.height-(f.height+b.height));l===0?(Kr(),a.style.overflowY="hidden"):a.style.overflowY=a.scrollHeight>T?"auto":"hidden"}function et(){if(!a)return;let l=gt(),m=document.querySelector(".ytp-progress-bar"),f=ye(),b=f?f.getVideoData():null,T=!!b&&!!b.isLive;if(!l||!m||!isFinite(l.duration)||T)return;Va();let{items:S,starts:x}=Rn(),_=l.duration,N=document.createDocumentFragment();S.forEach((D,O)=>{let G=x[O];if(!Number.isFinite(G))return;D.dataset.guid||(D.dataset.guid=crypto.randomUUID());let ie=document.createElement("div");ie.className="ytls-marker",ie.style.left=G/_*100+"%",ie.dataset.time=String(G),N.appendChild(ie)}),m.appendChild(N),jc(m)}function jc(l){l.dataset.ytlsMarkerClicks||(l.dataset.ytlsMarkerClicks="1",l.addEventListener("click",m=>{let f=m.target?.closest?.(".ytls-marker");if(!f)return;let b=Number(f.dataset.time),T=ye();T&&Number.isFinite(b)&&T.seekTo(b)}))}function Ro(l,m={}){if(!a||Ht()||!l)return;if(ae){d("Save blocked: timestamps are currently loading");return}Ct();let f=bi().sort((b,T)=>b.start-T.start);if(f.length===0&&!m.allowEmpty){d("Save skipped: no timestamps to save");return}we(f),Ua(l,f).then(()=>{d(`Successfully saved ${f.length} timestamps for ${l} to IndexedDB`),Po()}).catch(b=>{let T=`Failed to save timestamps: ${b.message}`;d(`Failed to save timestamps for ${l} to IndexedDB:`,b,"error"),dr(T)}),$r({type:"timestamps_updated",videoId:l,action:"saved"})}function ur(l,m,f,b){if(!l||ae||Ht())return;let T={guid:m,start:f,comment:b};d(`Saving timestamp: guid=${m}, start=${f}, comment="${b}"`),Yc(l,T).then(()=>{a&&Po()}).catch(S=>{let x=`Failed to save timestamp: ${S.message}`;d(`Failed to save timestamp ${m}:`,S,"error"),dr(x)}),$r({type:"timestamps_updated",videoId:l,action:"saved"})}function Vc(l,m){!l||ae||Ht()||(Kc(l,m).then(()=>{a&&Po()}).catch(f=>{let b=`Failed to delete timestamp: ${f.message}`;d(`Failed to delete timestamp ${m}:`,f,"error"),dr(b)}),$r({type:"timestamps_updated",videoId:l,action:"saved"}))}async function ja(l){if(Ht()){alert("Cannot export timestamps while an error is being displayed.");return}let m=Pe;if(!m)return;d(`Exporting timestamps for video ID: ${m}`);let f=bi(),b=Math.max(It(),0),T=tr();if(l==="json"){let S=new Blob([JSON.stringify(f,null,2)],{type:"application/json"}),x=URL.createObjectURL(S),_=document.createElement("a");_.href=x,_.download=`timestamps-${m}-${T}.json`,_.click(),URL.revokeObjectURL(x)}else if(l==="text"){let S=f.map(D=>{let O=Vt(D.start,b),G=`${D.comment} <!-- guid:${D.guid} -->`.trimStart();return`${O} ${G}`}).join(`
`),x=new Blob([S],{type:"text/plain"}),_=URL.createObjectURL(x),N=document.createElement("a");N.href=_,N.download=`timestamps-${m}-${T}.txt`,N.click(),URL.revokeObjectURL(_)}}function dr(l){if(!o||!a){d("Timekeeper error:",l,"error");return}kl(a,l),Yi(l),et()}function Po(){a&&(Tl(a),Yi(null))}function Ht(){return!!(!a||ao(a)||ae||Rl()!==null)}function Va(){document.querySelectorAll(".ytls-marker").forEach(l=>l.remove())}function pr(){if(!o||!document.body.contains(o))return;let l=o.getBoundingClientRect(),m=document.documentElement.clientWidth,f=document.documentElement.clientHeight,b=l.width,T=l.height;if(l.left<0&&(o.style.left="0",o.style.right="auto"),l.right>m){let S=Math.max(0,m-b);o.style.left=`${S}px`,o.style.right="auto"}if(l.top<0&&(o.style.top="0",o.style.bottom="auto"),l.bottom>f){let S=Math.max(0,f-T);o.style.top=`${S}px`,o.style.bottom="auto"}}function Uc(){if(xo&&(document.removeEventListener("mousemove",xo),xo=null),ko&&(document.removeEventListener("mouseup",ko),ko=null),Vr&&(document.removeEventListener("keydown",Vr),Vr=null),To&&(window.removeEventListener("resize",To),To=null),Ur&&(document.removeEventListener("pointerdown",Ur,!0),Ur=null),Gr&&(document.removeEventListener("pointerup",Gr,!0),Gr=null),Mt){try{Mt.disconnect()}catch{}Mt=null}if(Lt){try{Lt.disconnect()}catch{}Lt=null}let l=gt();l&&(So&&(l.removeEventListener("timeupdate",So),So=null),Eo&&(l.removeEventListener("pause",Eo),Eo=null),_o&&(l.removeEventListener("play",_o),_o=null),Ao&&(l.removeEventListener("seeking",Ao),Ao=null),Mo&&(l.removeEventListener("ratechange",Mo),Mo=null))}function Gc(){Va(),In.forEach(m=>clearTimeout(m)),In.clear(),jr&&(clearTimeout(jr),jr=null),_e&&(clearInterval(_e),_e=null),_t&&(clearTimeout(_t),_t=null),Uc(),Qs();try{Nt.close()}catch{}if(Z&&Z.parentNode===document.body&&document.body.removeChild(Z),Z=null,bo=null,Cn=!1,Pe=null,Mt){try{Mt.disconnect()}catch{}Mt=null}if(Lt){try{Lt.disconnect()}catch{}Lt=null}o&&o.parentNode&&o.remove();let l=document.getElementById("ytls-header-button");l&&l.parentNode&&l.remove(),pn=null,wo=!1,U(null),Yr(),o=null,s=null,a=null,p=null,it=null,dn=null,je=null,c=null,u=null,A=null,Ln=null}async function qc(){let l=Si();if(!l)return Ln=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let m=await Rc();if(!fi(m)){let f=Bc(m),b=f.length?` Missing methods: ${f.join(", ")}.`:"",T=m?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return Ln=null,{ok:!1,message:`${T}${b} Try refreshing once playback is ready.`}}return Ln=m,{ok:!0,player:m,videoId:l}}async function Ti(){if(!o||!a)return;let l=a.scrollTop,m=!0,f=()=>{if(!a||!m)return;let b=Math.max(0,a.scrollHeight-a.clientHeight);a.scrollTop=Math.min(l,b)};try{let b=await qc();if(!b.ok){dr(b.message),Yr(),et();return}let{videoId:T}=b,S=[];try{let x=await Jc(T);x?(S=x.map(_=>({..._,guid:_.guid||crypto.randomUUID()})),d(`Loaded ${S.length} timestamps from IndexedDB for ${T}`),Po()):d(`No timestamps found in IndexedDB for ${T}`)}catch(x){let _=`Failed to load timestamps: ${x.message}`;d(`Failed to load timestamps from IndexedDB for ${T}:`,x,"error"),dr(_),et();return}if(S.length>0){S.sort((N,D)=>N.start-D.start),Yr(),wi();let x=document.createDocumentFragment();S.forEach(N=>{let O=Jr(N.start,N.comment,!0,N.guid,!1).__ytls_li;O&&x.appendChild(O)}),o&&o.classList.contains("ytls-zoom-in")&&Ie!=null?(d("Deferring timestamp DOM append until show animation completes"),Dn=x,Jt||(Jt=new Promise(N=>{mt=N})),await Jt):a&&(a.appendChild(x),mn(),fn(),Ct(),et(),je&&requestAnimationFrame(je)),we(S),Dt(!0),m=!1}else Yr(),Oa("No timestamps for this video"),et(),we([]),je&&requestAnimationFrame(je)}catch(b){d("Unexpected error while loading timestamps:",b,"error"),dr("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Jt&&await Jt,requestAnimationFrame(f),je&&requestAnimationFrame(je),a&&!ao(a)&&Kr()}}function Si(){let m=new URLSearchParams(location.search).get("v");if(m)return m;let f=document.querySelector('meta[itemprop="identifier"]');return f?.content?f.content:null}function Zc(l=null,m=null){if(!c)return;let f=gt(),b=m||ye();if(!f&&!b)return;let T=l!==null?l:b?b.getCurrentTime():0,S=Number.isFinite(T)?Math.max(0,Math.floor(T)):Math.max(0,It()),{isLive:x}=b?b.getVideoData()||{isLive:!1}:{isLive:!1},_=b?Na(b):!1,N=a?Rn().rawTimes:[],D="";if(N.length>0)if(x){let O=Math.max(1,S/60),G=N.filter(ie=>ie<=S);if(G.length>0){let ie=(G.length/O).toFixed(2);parseFloat(ie)>0&&(D=` (${ie}/min)`)}}else{let O=b?b.getDuration():0,G=Number.isFinite(O)&&O>0?O:f&&Number.isFinite(f.duration)&&f.duration>0?f.duration:0,ie=Math.max(1,G/60),ke=(N.length/ie).toFixed(1);parseFloat(ke)>0&&(D=` (${ke}/min)`)}c.textContent=`${Vt(S)}${D}`,c.style.color=_?"#ff4d4f":""}function Wc(){let l=gt();if(!l)return;let m=NaN,f=null,b=()=>{if(!a)return;let D=ye(),O=D?Math.floor(D.getCurrentTime()):0;if(!Number.isFinite(O))return;let G=Rn();if(O===m&&G===f)return;let ie=!!c&&!ae&&!zt;ie&&Zc(O,D),Dt(!1,O),ie&&!Cn&&(m=O,f=G)},T=D=>{try{let O=new URL(window.location.href);D!==null&&Number.isFinite(D)?O.searchParams.set("t",`${Math.floor(D)}s`):O.searchParams.delete("t"),window.history.replaceState(window.history.state,"",O.toString())}catch{}},S=()=>{let D=ye(),O=D?D.getCurrentTime():NaN,G=Number.isFinite(O)?Math.max(0,Math.floor(O)):Math.max(0,It());if(Number.isFinite(G)){T(G);try{Dt(!0)}catch(ie){d("Failed to highlight nearest timestamp on pause:",ie,"warn")}}},x=()=>{T(null);try{let D=ye(),O=D?D.getCurrentTime():NaN,G=Number.isFinite(O)?Math.max(0,Math.floor(O)):Math.max(0,It());Number.isFinite(G)&&Dt(!0)}catch(D){d("Failed to highlight nearest timestamp on play:",D,"warn")}},_=()=>{let D=gt();if(!D)return;let O=ye(),G=O?Math.floor(O.getCurrentTime()):0;Number.isFinite(G)&&(D.paused&&T(G),Dt(!0,G))},N=()=>{let D=l.playbackRate;y?y=!1:Ic(D),mi(D)};So=b,Eo=S,_o=x,Ao=_,Mo=N,l.addEventListener("timeupdate",b),l.addEventListener("pause",S),l.addEventListener("play",x),l.addEventListener("seeking",_),l.addEventListener("ratechange",N)}let{saveToIndexedDB:Ua,saveSingleTimestampToIndexedDB:Yc,deleteSingleTimestampFromIndexedDB:Kc,loadFromIndexedDB:Jc,removeFromIndexedDB:Xc,saveGlobalSettings:Oo,loadGlobalSettings:Ei,buildExportPayload:Qc,mergeBackupData:eu,exportAllTimestamps:tu,buildExportCsvPayload:wm,exportAllTimestampsCsv:nu}=Vi;function Ga(){if(!o)return;let l=o.style.display!=="none";Oo("uiVisible",l)}function Xt(l){let m=typeof l=="boolean"?l:!!o&&o.style.display!=="none",f=document.getElementById("ytls-header-button");f instanceof HTMLButtonElement&&f.setAttribute("aria-pressed",String(m)),pn&&!wo&&pn.src!==Et&&(pn.src=Et)}function ru(){o&&Ei("uiVisible").then(l=>{let m=q.boolean().safeParse(l),f=m.success?m.data:void 0;typeof f=="boolean"?(f?(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in")):o.style.display="none",Xt(f)):(!m.success&&l!==void 0&&d("UI visibility state failed validation, defaulting to visible",m.error.format(),"warn"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Xt(!0))}).catch(l=>{d("Failed to load UI visibility state:",l,"error"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Xt(!0)})}function _i(l){if(!o){d("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(o)||(d("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(T=>{T!==o&&T.remove()}),document.body.appendChild(o));let m=document.querySelectorAll("#ytls-pane");m.length>1&&(d(`ERROR: Multiple panes detected in togglePaneVisibility (${m.length}), cleaning up`),m.forEach(T=>{T!==o&&T.remove()})),_t&&(clearTimeout(_t),_t=null);let f=o.style.display==="none";(typeof l=="boolean"?l:f)?(o.style.display="flex",o.classList.remove("ytls-fade-out"),o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Xt(!0),Ga(),Qe(),Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{Be(),je?.(),fe(),xe(!0);try{Dt(!0)}catch(T){d("Failed to scroll to nearest timestamp after toggle:",T,"warn")}Ie=null},450)):(o.classList.remove("ytls-fade-in"),o.classList.remove("ytls-zoom-in"),o.classList.add("ytls-zoom-out"),Xt(!1),St())}function qa(l){if(!a){d("UI is not initialized; cannot import timestamps.","warn");return}let m=!1;try{let f=JSON.parse(l),b=null;if(Array.isArray(f))b=f;else if(typeof f=="object"&&f!==null){let T=Pe;if(T){let S=`timekeeper-${T}`;f[S]&&Array.isArray(f[S].timestamps)&&(b=f[S].timestamps,d(`Found timestamps for current video (${T}) in export format`,"info"))}if(!b){let S=Object.keys(f).filter(x=>x.startsWith("ytls-"));if(S.length===1&&Array.isArray(f[S[0]].timestamps)){b=f[S[0]].timestamps;let x=f[S[0]].video_id;d(`Found timestamps for video ${x} in export format`,"info")}}}b&&Array.isArray(b)?b.every(S=>typeof S.start=="number"&&typeof S.comment=="string")?(b.forEach(S=>{if(S.guid){let x=Oe().find(_=>_.dataset.guid===S.guid);if(x){let _=x.querySelector("input");_&&(_.value=S.comment)}else Jr(S.start,S.comment,!1,S.guid)}else Jr(S.start,S.comment,!1,crypto.randomUUID())}),m=!0):d("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):d("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!m){let f=l.split(`
`).map(b=>b.trim()).filter(b=>b);if(f.length>0){let b=!1;f.forEach(T=>{let S=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(S){b=!0;let x=parseInt(S[1])||0,_=parseInt(S[2]),N=parseInt(S[3]),D=x*3600+_*60+N,O=S[4]?S[4].trim():"",G=null,ie=O,ke=O.match(/<!--\s*guid:([^>]+?)\s*-->/);ke&&(G=ke[1].trim(),ie=O.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let at;if(G&&(at=Oe().find(oe=>oe.dataset.guid===G)),!at&&!G&&(at=Oe().find(oe=>{if(oe.dataset.guid)return!1;let tt=oe.querySelector("[data-time]")?.dataset.time;if(!tt)return!1;let nt=Number.parseInt(tt,10);return Number.isFinite(nt)&&nt===D})),at){let oe=at.querySelector("input");oe&&(oe.value=ie)}else Jr(D,ie,!1,G||crypto.randomUUID())}}),b&&(m=!0)}}m?(d("Timestamps changed: Imported timestamps from file/clipboard"),Ct(),Ro(Pe),et(),Bo()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function ou(){if(yi){d("Pane initialization already in progress, skipping duplicate call");return}if(!(o&&document.body.contains(o))){yi=!0;try{let T=function(h=null,v=null){if(!c)return;let w=gt(),k=v||ye();if(!w&&!k)return;let C=h!==null?h:k?k.getCurrentTime():0,K=Number.isFinite(C)?Math.max(0,Math.floor(C)):Math.max(0,It()),{isLive:F}=k?k.getVideoData()||{isLive:!1}:{isLive:!1},W=k?Na(k):!1,j=a?Rn().rawTimes:[],ne="";if(j.length>0)if(F){let he=Math.max(1,K/60),de=j.filter(Ve=>Ve<=K);if(de.length>0){let Ve=(de.length/he).toFixed(2);parseFloat(Ve)>0&&(ne=` (${Ve}/min)`)}}else{let he=k?k.getDuration():0,de=Number.isFinite(he)&&he>0?he:w&&Number.isFinite(w.duration)&&w.duration>0?w.duration:0,Ve=Math.max(1,de/60),ft=(j.length/Ve).toFixed(1);parseFloat(ft)>0&&(ne=` (${ft}/min)`)}c.textContent=`${Vt(K)}${ne}`,c.style.color=W?"#ff4d4f":"",b();try{mi()}catch{}},S=function(){if(ae||zt)return;let h=ye();if(!h)return;let v=h.getCurrentTime(),w=Number.isFinite(v)?Math.max(0,Math.floor(v)):Math.max(0,It());T(w,h),(a?Oe():[]).length>0&&Dt(!1,w)},Ne=function(h,v,w,k){let C=document.createElement("button");return k?ge(C,k,h):C.textContent=h,dt(C,v),C.classList.add("ytls-settings-modal-button"),C.onclick=w,C},tt=function(h="general"){if(Z&&Z.parentNode===document.body){let qe=document.getElementById("ytls-save-modal"),bn=document.getElementById("ytls-load-modal"),en=document.getElementById("ytls-delete-all-modal");qe&&document.body.contains(qe)&&document.body.removeChild(qe),bn&&document.body.contains(bn)&&document.body.removeChild(bn),en&&document.body.contains(en)&&document.body.removeChild(en),Z.classList.remove("ytls-fade-in"),Z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Z)&&document.body.removeChild(Z),Z=null,document.removeEventListener("click",hn,!0),document.removeEventListener("keydown",nt)},300);return}Z=document.createElement("div"),Z.id="ytls-settings-modal",Z.classList.remove("ytls-fade-out"),Z.classList.add("ytls-fade-in");let v=document.createElement("div");v.className="ytls-modal-header";let w=document.createElement("div");w.id="ytls-settings-nav";let k=document.createElement("button");k.className="ytls-modal-close-button",We(k,"x",14),k.onclick=()=>{if(Z&&Z.parentNode===document.body){let qe=document.getElementById("ytls-save-modal"),bn=document.getElementById("ytls-load-modal"),en=document.getElementById("ytls-delete-all-modal");qe&&document.body.contains(qe)&&document.body.removeChild(qe),bn&&document.body.contains(bn)&&document.body.removeChild(bn),en&&document.body.contains(en)&&document.body.removeChild(en),Z.classList.remove("ytls-fade-in"),Z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Z)&&document.body.removeChild(Z),Z=null,document.removeEventListener("click",hn,!0),document.removeEventListener("keydown",nt)},300)}};let C=document.createElement("div");C.id="ytls-settings-content";let K=document.createElement("h3");K.className="ytls-section-heading",K.textContent="General",K.style.display="none";let F=document.createElement("div"),W=document.createElement("div");W.className="ytls-button-grid";function j(qe){F.style.display=qe==="general"?"block":"none",W.style.display=qe==="google"?"block":"none",ne.classList.toggle("active",qe==="general"),de.classList.toggle("active",qe==="google"),K.textContent=qe==="general"?"General":"Google"}let ne=document.createElement("button");ne.appendChild(no("adjustments-horizontal",16));let he=document.createElement("span");he.className="ytls-tab-text",he.textContent=" General",ne.appendChild(he),dt(ne,"General settings"),ne.classList.add("ytls-settings-modal-button"),ne.onclick=()=>j("general");let de=document.createElement("button");de.appendChild(no("cloud",16));let Ve=document.createElement("span");Ve.className="ytls-tab-text",Ve.textContent=" Google",de.appendChild(Ve),dt(de,"Google Drive backup settings"),de.classList.add("ytls-settings-modal-button"),de.onclick=async()=>{Tt.isSignedIn&&await kc(),j("google")},w.appendChild(ne),w.appendChild(de),v.appendChild(w),v.appendChild(k),Z.appendChild(v),F.className="ytls-button-grid",F.appendChild(Ne("Save","Save As...",Pn.onclick,"device-floppy")),F.appendChild(Ne("Load","Load",mr.onclick,"folder-open")),F.appendChild(Ne("Export All","Export All Data",gn.onclick,"file-export")),F.appendChild(Ne("Import All","Import All Data",fr.onclick,"file-import")),F.appendChild(Ne("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await nu()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let ft=Ne(Tt.isSignedIn?"Sign Out":"Sign In",Tt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{Tt.isSignedIn?await xc():await bc(),ge(ft,Tt.isSignedIn?"logout":"login",Tt.isSignedIn?"Sign Out":"Sign In"),dt(ft,Tt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),Ae()},Tt.isSignedIn?"logout":"login"),wr=Ne(vo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Mc(),yn(),Ae()},"refresh"),zn=Ne(`Backup Interval: ${Yt()}min`,"Set periodic backup interval (minutes)",async()=>{await Lc(),yn(),Ae()},"clock-plus"),yn=()=>{ge(ft,Tt.isSignedIn?"logout":"login",Tt.isSignedIn?"Sign Out":"Sign In"),dt(ft,Tt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ge(wr,"refresh",vo()?"Auto Backup: On":"Auto Backup: Off"),ge(zn,"clock-plus",`Backup Interval: ${Yt()}min`),typeof Ae=="function"&&Ae()};W.appendChild(ft),W.appendChild(wr),W.appendChild(zn),W.appendChild(Ne("Backup Now","Run a backup immediately",async()=>{await go({silent:!1,skipBackoff:!0}),yn()},"database"));let yt=document.createElement("div");yt.style.marginTop="15px",yt.style.paddingTop="10px",yt.style.borderTop="1px solid #555",yt.style.fontSize="12px",yt.style.color="#aaa";let Zo=document.createElement("div");Zo.style.marginBottom="8px",Zo.style.fontWeight="bold",yt.appendChild(Zo),cc(Zo);let Ii=document.createElement("div");Ii.style.marginBottom="8px",sc(Ii),yt.appendChild(Ii);let ns=document.createElement("div");lc(ns),yt.appendChild(ns),W.appendChild(yt),pt(),zr(),Ae(),yn(),C.appendChild(K),C.appendChild(F),C.appendChild(W),j(h==="drive"?"google":h),Z.appendChild(C),document.body.appendChild(Z),requestAnimationFrame(()=>{let qe=Z.getBoundingClientRect(),en=(window.innerHeight-qe.height)/2;Z.style.top=`${Math.max(20,en)}px`,Z.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",hn,!0),document.addEventListener("keydown",nt)},0)},nt=function(h){if(h.key==="Escape"&&Z&&Z.parentNode===document.body){let v=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");if(v||w||k)return;h.preventDefault(),v&&document.body.contains(v)&&document.body.removeChild(v),w&&document.body.contains(w)&&document.body.removeChild(w),k&&document.body.contains(k)&&document.body.removeChild(k),Z.classList.remove("ytls-fade-in"),Z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Z)&&document.body.removeChild(Z),Z=null,document.removeEventListener("click",hn,!0),document.removeEventListener("keydown",nt)},300)}},hn=function(h){if(bo&&bo.contains(h.target))return;let v=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");v&&v.contains(h.target)||w&&w.contains(h.target)||k&&k.contains(h.target)||Z&&Z.contains(h.target)||(v&&document.body.contains(v)&&document.body.removeChild(v),w&&document.body.contains(w)&&document.body.removeChild(w),k&&document.body.contains(k)&&document.body.removeChild(k),Z&&Z.parentNode===document.body&&(Z.classList.remove("ytls-fade-in"),Z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(Z)&&document.body.removeChild(Z),Z=null,document.removeEventListener("click",hn,!0),document.removeEventListener("keydown",nt)},300)))},Xr=function(){o&&(d("Loading window position from IndexedDB"),Ei("windowPosition").then(h=>{let v=tl.safeParse(h);if(v.success){let k=v.data;o.style.left=`${k.x}px`,o.style.top=`${k.y}px`,o.style.right="auto",o.style.bottom="auto",typeof k.width=="number"&&k.width>0?o.style.width=`${k.width}px`:(o.style.width=`${hi}px`,d(`No stored window width found, using default width ${hi}px`)),typeof k.height=="number"&&k.height>0?o.style.height=`${k.height}px`:(o.style.height=`${gi}px`,d(`No stored window height found, using default height ${gi}px`));let C=Me();De(C,k.x,k.y),d("Restored window position from IndexedDB:",Q())}else v.success?d("No window position found in IndexedDB, applying default size and leaving default position"):d("Window position in IndexedDB failed validation:",v.error.format(),"warn"),o.style.width=`${hi}px`,o.style.height=`${gi}px`,U(null);pr();let w=Me();w&&(w.width||w.height)&&De(w),je?.()}).catch(h=>{d("failed to load pane position from IndexedDB:",h,"warn"),pr();let v=Me();v&&(v.width||v.height)&&U({x:Math.max(0,Math.round(v.left)),y:0,width:Math.round(v.width),height:Math.round(v.height)}),je?.()}))},No=function(){if(!o)return;let h=Me();if(!h)return;let v={x:Math.max(0,Math.round(h.left)),y:Math.max(0,Math.round(h.top)),width:Math.round(h.width),height:Math.round(h.height)},w=Q();if(w&&w.x===v.x&&w.y===v.y&&w.width===v.width&&w.height===v.height){d("Skipping window position save; position and size unchanged");return}U({...v}),d(`Saving window position and size to IndexedDB: x=${v.x}, y=${v.y}, width=${v.width}, height=${v.height}`),Oo("windowPosition",v),$r({type:"window_position_updated",position:v,timestamp:Date.now()})},Vo=function(h,v){h.addEventListener("dblclick",w=>{w.preventDefault(),w.stopPropagation(),o&&(o.style.width="300px",o.style.height="300px",No(),qo())}),h.addEventListener("mousedown",w=>{w.preventDefault(),w.stopPropagation(),Nn=!0,vn=v,Ya=w.clientX,Ka=w.clientY;let k=o.getBoundingClientRect();gr=k.width,vr=k.height,Fo=k.left,jo=k.top,Ja=document.documentElement.clientWidth,Xa=document.documentElement.clientHeight,v==="top-left"||v==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},es=function(){if(!a||!dn)return;let{scrollTop:h,scrollHeight:v,clientHeight:w}=a;if(v<=w)return;let k=Math.max(30,w/v*w),C=h/(v-w)*(w-k);dn.style.height=`${k}px`,dn.style.top=`${C}px`},ts=function(){it&&(Li===null&&(Li=requestAnimationFrame(()=>{Li=null,es()})),it.classList.add("ytls-scrollbar-visible"),At&&clearTimeout(At),At=setTimeout(()=>{it?.classList.remove("ytls-scrollbar-visible"),At=null},500))},qo=function(){if(o&&s&&p&&a){let h=o.getBoundingClientRect(),v=s.getBoundingClientRect(),w=p.getBoundingClientRect(),k=h.height-(v.height+w.height);a.style.maxHeight=k>0?k+"px":"0px",a.style.overflowY=k>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(h=>h.remove()),!document.getElementById("ytls-styles")){let h=document.createElement("style");h.id="ytls-styles",h.textContent=Ks,document.head.appendChild(h)}o=document.createElement("div"),s=document.createElement("div"),a=document.createElement("ul"),p=document.createElement("div"),c=document.createElement("span"),A=document.createElement("span"),R=document.createElement("span"),R.classList.add("ytls-backup-indicator"),R.style.cursor="pointer",R.style.backgroundColor="#666",R.onclick=h=>{h.stopPropagation(),tt("drive")},a.addEventListener("mouseenter",()=>{Cn=!0,so(!0),qr=!1}),a.addEventListener("mouseleave",()=>{Cn=!1,so(!1);try{Pi()}catch{}if(qr)return;Dt(!1);let h=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)&&(h=document.activeElement.closest("li")?.dataset.guid??null),Fa(),h){let w=Oe().find(k=>k.dataset.guid===h)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}}),o.id="ytls-pane",s.id="ytls-pane-header",s.addEventListener("dblclick",h=>{let v=h.target instanceof Element?h.target:null;if(v){let w=v;for(;w&&w!==o;){if(window.getComputedStyle(w).cursor==="pointer")return;w=w.parentElement}}h.preventDefault(),_i(!1)});let l=h=>{try{h.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(h=>{o.addEventListener(h,l)}),o.addEventListener("keydown",h=>{try{h.stopPropagation()}catch{}}),o.addEventListener("keyup",h=>{try{h.stopPropagation()}catch{}}),o.addEventListener("focus",h=>{try{h.stopPropagation()}catch{}},!0),o.addEventListener("blur",h=>{try{h.stopPropagation()}catch{}},!0),A.textContent=`v${Qo}`,A.classList.add("ytls-version-display");let m=document.createElement("span");m.style.display="inline-flex",m.style.alignItems="center",m.style.gap="6px",m.appendChild(A),m.appendChild(R),c.id="ytls-current-time",c.textContent="\u2014",c.style.cursor="default",dt(c,()=>{let h=ye(),{isLive:v}=h?h.getVideoData()||{isLive:!1}:{isLive:!1};return v?"Skip to live":""}),u=document.createElement("span"),u.id="ytls-playback-speed",u.textContent="1x",u.style.cursor="pointer",u.style.userSelect="none",dt(u,()=>`Current playback speed. Click to toggle between 1x and ${Ta(g)}x.`),u.onclick=()=>{Sa()},u.addEventListener("mousedown",h=>{h.stopPropagation()}),u.addEventListener("click",h=>{h.stopPropagation()}),c.onclick=()=>{let h=ye();if(!h)return;let{isLive:v}=h.getVideoData()||{isLive:!1};v&&(zt=!0,h.seekToLiveHead(),setTimeout(()=>{zt=!1},500))};let b=()=>{let h=ye();if(!h){c.style.cursor="default";return}let{isLive:v}=h.getVideoData()||{isLive:!1};c.style.cursor=v?"pointer":"default"};S(),_e&&clearInterval(_e),_e=setInterval(S,1e3),p.id="ytls-buttons";let x=(h,v)=>()=>{h.classList.remove("ytls-fade-in"),h.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(h)&&document.body.removeChild(h),v&&v()},300)},_=h=>v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),h())},N=h=>{setTimeout(()=>{document.addEventListener("keydown",h)},0)},D=(h,v)=>w=>{h.contains(w.target)||v()},O=h=>{setTimeout(()=>{document.addEventListener("click",h,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(Ht())return;let h=typeof lr<"u"?lr:0,v=ye(),w=v?Math.floor(v.getCurrentTime()+h):0;if(!Number.isFinite(w))return;let k=Jr(w,"");k&&k.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>tt()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(h){if(Ht()){We(this,"circle-x",20),setTimeout(()=>{We(this,"clipboard",20)},2e3);return}let v=bi(),w=Math.max(It(),0);if(v.length===0){We(this,"circle-x",20),setTimeout(()=>{We(this,"clipboard",20)},2e3);return}let k=h.ctrlKey,C=v.map(K=>{let F=Vt(K.start,w);return k?`${F} ${K.comment} <!-- guid:${K.guid} -->`.trimStart():`${F} ${K.comment}`}).join(`
`);navigator.clipboard.writeText(C).then(()=>{We(this,"circle-check",20),setTimeout(()=>{We(this,"clipboard",20)},2e3)}).catch(K=>{d("Failed to copy timestamps: ",K,"error"),We(this,"circle-x",20),setTimeout(()=>{We(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(Ht())return;if(Oe().length===0){alert("No timestamps available to offset.");return}let v=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(v===null)return;let w=v.trim();if(w.length===0)return;let k=Number.parseInt(w,10);if(!Number.isFinite(k)){alert("Please enter a valid integer number of seconds.");return}k!==0&&Ha(k,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let h=Si();if(!h){alert("Unable to determine current video ID.");return}let v=document.createElement("div");v.id="ytls-delete-all-modal",v.classList.remove("ytls-fade-out"),v.classList.add("ytls-fade-in");let w=document.createElement("p");w.textContent="Hold the button to delete all timestamps for:",w.style.marginBottom="10px";let k=document.createElement("p");k.textContent=h,k.style.fontFamily="monospace",k.style.fontSize="12px",k.style.marginBottom="15px",k.style.color="#aaa";let C=document.createElement("button");C.classList.add("ytls-save-modal-button"),C.style.background="#d32f2f",C.style.position="relative",C.style.overflow="hidden";let K=null,F=0,W=null,j=document.createElement("div");j.style.position="absolute",j.style.left="0",j.style.top="0",j.style.height="100%",j.style.width="0%",j.style.background="#ff6b6b",j.style.transition="none",j.style.pointerEvents="none",C.appendChild(j);let ne=document.createElement("span");ne.textContent="Hold to Delete All",ne.style.position="relative",ne.style.zIndex="1",C.appendChild(ne);let he=()=>{if(!F)return;let yn=Date.now()-F,yt=Math.min(yn/5e3*100,100);j.style.width=`${yt}%`,yt<100&&(W=requestAnimationFrame(he))},de=()=>{K&&(clearTimeout(K),K=null),W&&(cancelAnimationFrame(W),W=null),F=0,j.style.width="0%",ne.textContent="Hold to Delete All"};C.onmousedown=()=>{F=Date.now(),ne.textContent="Deleting...",W=requestAnimationFrame(he),K=setTimeout(async()=>{de(),v.classList.remove("ytls-fade-in"),v.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(v)&&document.body.removeChild(v);try{await Xc(h),Ai()}catch(yn){d("Failed to delete all timestamps:",yn,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},C.onmouseup=de,C.onmouseleave=de;let Ve=null,ft=null,wr=x(v,()=>{de(),Ve&&document.removeEventListener("keydown",Ve),ft&&document.removeEventListener("click",ft,!0)});Ve=_(wr),ft=D(v,wr);let zn=document.createElement("button");zn.textContent="Cancel",zn.classList.add("ytls-save-modal-cancel-button"),zn.onclick=wr,v.appendChild(w),v.appendChild(k),v.appendChild(C),v.appendChild(zn),document.body.appendChild(v),N(Ve),O(ft)}}].forEach(h=>{let v=document.createElement("button");We(v,h.icon,20),dt(v,h.title),v.classList.add("ytls-main-button"),h.id==="copy"?v.onclick=function(w){h.action.call(this,w)}:v.onclick=h.action,h.id==="settings"&&(bo=v),p.appendChild(v)});let Pn=document.createElement("button");ge(Pn,"device-floppy","Save"),Pn.classList.add("ytls-file-operation-button"),Pn.onclick=()=>{let h=document.createElement("div");h.id="ytls-save-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Save as:";let w=null,k=null,C=x(h,()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0)});w=_(C),k=D(h,C);let K=document.createElement("button");K.textContent="JSON",K.classList.add("ytls-save-modal-button"),K.onclick=()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),x(h,()=>ja("json"))()};let F=document.createElement("button");F.textContent="Plain Text",F.classList.add("ytls-save-modal-button"),F.onclick=()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),x(h,()=>ja("text"))()};let W=document.createElement("button");W.textContent="Cancel",W.classList.add("ytls-save-modal-cancel-button"),W.onclick=C,h.appendChild(v),h.appendChild(K),h.appendChild(F),h.appendChild(W),document.body.appendChild(h),N(w),O(k)};let mr=document.createElement("button");ge(mr,"folder-open","Load"),mr.classList.add("ytls-file-operation-button"),mr.onclick=()=>{let h=document.createElement("div");h.id="ytls-load-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Load from:";let w=null,k=null,C=x(h,()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0)});w=_(C),k=D(h,C);let K=document.createElement("button");K.textContent="File",K.classList.add("ytls-save-modal-button"),K.onclick=()=>{let j=document.createElement("input");j.type="file",j.accept=".json,.txt",j.classList.add("ytls-hidden-file-input"),j.onchange=ne=>{let he=ne.target.files?.[0];if(!he)return;w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),C();let de=new FileReader;de.onload=()=>{let Ve=String(de.result).trim();qa(Ve)},de.readAsText(he)},j.click()};let F=document.createElement("button");F.textContent="Clipboard",F.classList.add("ytls-save-modal-button"),F.onclick=async()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),x(h,async()=>{try{let j=await navigator.clipboard.readText();j?qa(j.trim()):alert("Clipboard is empty.")}catch(j){d("Failed to read from clipboard: ",j,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let W=document.createElement("button");W.textContent="Cancel",W.classList.add("ytls-save-modal-cancel-button"),W.onclick=C,h.appendChild(v),h.appendChild(K),h.appendChild(F),h.appendChild(W),document.body.appendChild(h),N(w),O(k)};let gn=document.createElement("button");ge(gn,"file-export","Export"),gn.classList.add("ytls-file-operation-button"),gn.onclick=async()=>{try{await tu()}catch{alert("Failed to export data: Could not read from database.")}};let fr=document.createElement("button");ge(fr,"file-import","Import"),fr.classList.add("ytls-file-operation-button"),fr.onclick=()=>{let h=document.createElement("input");h.type="file",h.accept=".json",h.classList.add("ytls-hidden-file-input"),h.onchange=v=>{let w=v.target.files?.[0];if(!w)return;let k=new FileReader;k.onload=()=>{try{let C=JSON.parse(String(k.result)),K=[];for(let F in C)if(Object.prototype.hasOwnProperty.call(C,F)&&F.startsWith("ytls-")){let W=F.substring(5),j=C[F];if(j&&typeof j.video_id=="string"&&Array.isArray(j.timestamps)){let ne=j.timestamps.map(de=>({...de,guid:de.guid||crypto.randomUUID()})),he=Ua(W,ne).then(()=>d(`Imported ${W} to IndexedDB`)).catch(de=>d(`Failed to import ${W} to IndexedDB:`,de,"error"));K.push(he)}else d(`Skipping key ${F} during import due to unexpected data format.`,"warn")}Promise.all(K).then(()=>{Ai()}).catch(F=>{alert("An error occurred during import to IndexedDB. Check console for details."),d("Overall import error:",F,"error")})}catch(C){alert(`Failed to import data. Please ensure the file is in the correct format.
`+C.message),d("Import error:",C,"error")}},k.readAsText(w)},h.click()},a.onclick=h=>{$a(h)},a.ontouchstart=h=>{$a(h)},o.style.position="fixed",o.style.bottom="0",o.style.right="0",o.style.transition="none",Xr(),setTimeout(()=>pr(),10);let Qt=!1,zo=0,Ho=0,On=0,$o=0,ee=0,te=0,me=null,ce=!1;o.addEventListener("mousedown",h=>{let v=h.target;if(!(v instanceof Element)||v instanceof HTMLInputElement||v instanceof HTMLTextAreaElement||v instanceof Element&&(v.closest("#ytls-playback-speed-group")||v.closest("#ytls-playback-speed"))||v!==s&&!s.contains(v)&&window.getComputedStyle(v).cursor==="pointer")return;Qt=!0,ce=!1;let w=o.getBoundingClientRect();zo=h.clientX-w.left,Ho=h.clientY-w.top,On=w.width,$o=w.height,ee=document.documentElement.clientWidth,te=document.documentElement.clientHeight,o.style.transition="none"}),document.addEventListener("mousemove",xo=h=>{if(!Qt)return;ce=!0;let v=h.clientX,w=h.clientY;me===null&&(me=requestAnimationFrame(()=>{if(me=null,!Qt)return;let k=Math.max(0,Math.min(v-zo,ee-On)),C=Math.max(0,Math.min(w-Ho,te-$o));o.style.left=`${k}px`,o.style.top=`${C}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",ko=()=>{if(!Qt)return;Qt=!1,me!==null&&(cancelAnimationFrame(me),me=null);let h=ce;setTimeout(()=>{ce=!1},50),pr(),setTimeout(()=>{h&&No()},200)}),o.addEventListener("dragstart",h=>h.preventDefault());let Ee=document.createElement("div"),rt=document.createElement("div"),vt=document.createElement("div"),hr=document.createElement("div");Ee.id="ytls-resize-tl",rt.id="ytls-resize-tr",vt.id="ytls-resize-bl",hr.id="ytls-resize-br";let Nn=!1,Ya=0,Ka=0,gr=0,vr=0,Fo=0,jo=0,Ja=0,Xa=0,yr=null,vn=null;Vo(Ee,"top-left"),Vo(rt,"top-right"),Vo(vt,"bottom-left"),Vo(hr,"bottom-right"),document.addEventListener("mousemove",h=>{if(!Nn||!o||!vn)return;let v=h.clientX,w=h.clientY;yr===null&&(yr=requestAnimationFrame(()=>{if(yr=null,!Nn||!o||!vn)return;let k=v-Ya,C=w-Ka,K=Ja,F=Xa,W=gr,j=vr,ne=Fo,he=jo;vn==="bottom-right"?(W=Math.max(200,Math.min(800,gr+k)),j=Math.max(250,Math.min(F,vr+C))):vn==="top-left"?(W=Math.max(200,Math.min(800,gr-k)),ne=Fo+k,j=Math.max(250,Math.min(F,vr-C)),he=jo+C):vn==="top-right"?(W=Math.max(200,Math.min(800,gr+k)),j=Math.max(250,Math.min(F,vr-C)),he=jo+C):vn==="bottom-left"&&(W=Math.max(200,Math.min(800,gr-k)),ne=Fo+k,j=Math.max(250,Math.min(F,vr+C))),ne=Math.max(0,Math.min(ne,K-W)),he=Math.max(0,Math.min(he,F-j)),o.style.width=`${W}px`,o.style.height=`${j}px`,o.style.left=`${ne}px`,o.style.top=`${he}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Nn&&(Nn=!1,yr!==null&&(cancelAnimationFrame(yr),yr=null),vn=null,document.body.style.cursor="",xe(!0))});let Uo=null;window.addEventListener("resize",To=()=>{Uo&&clearTimeout(Uo),Uo=setTimeout(()=>{xe(!0),je?.(),Uo=null},200)}),s.appendChild(c);let br=document.createElement("span");br.id="ytls-playback-speed-group",br.style.display="inline-flex",br.style.alignItems="center",br.style.marginLeft="4px",u&&br.appendChild(u),s.appendChild(br),s.appendChild(m);let Mi=document.createElement("div");Mi.id="ytls-list-wrapper",it=document.createElement("div"),it.className="ytls-scrollbar-track",dn=document.createElement("div"),dn.className="ytls-scrollbar-thumb",it.append(dn),Mi.append(a,it);let Go=document.createElement("div");Go.id="ytls-content",Go.append(Mi),Go.append(p),o.append(s,Go,Ee,rt,vt,hr);let Qa="";o.addEventListener("mousemove",h=>{if(Qt||Nn)return;let v=o.getBoundingClientRect(),w=20,k=h.clientX,C=h.clientY,K=k-v.left<=w,F=v.right-k<=w,W=C-v.top<=w,j=v.bottom-C<=w,ne="";W&&K||j&&F?ne="nwse-resize":(W&&F||j&&K)&&(ne="nesw-resize"),ne!==Qa&&(Qa=ne,document.body.style.cursor=ne)});let Li=null;if(it.addEventListener("mouseenter",()=>{At&&(clearTimeout(At),At=null),it.classList.add("ytls-scrollbar-visible")}),it.addEventListener("mouseleave",()=>{vi||(At=setTimeout(()=>{it?.classList.remove("ytls-scrollbar-visible"),At=null},500))}),dn.addEventListener("mousedown",h=>{if(!a)return;h.preventDefault(),h.stopPropagation(),vi=!0;let v=h.clientY,w=a.scrollTop,{scrollHeight:k,clientHeight:C}=a,K=Math.max(30,C/k*C),F=k-C,W=C-K;function j(he){if(!a)return;let de=he.clientY-v;a.scrollTop=Math.max(0,Math.min(F,w+de*(F/W))),es()}function ne(){vi=!1,document.removeEventListener("mousemove",j),document.removeEventListener("mouseup",ne),it?.matches(":hover")||(At=setTimeout(()=>{it?.classList.remove("ytls-scrollbar-visible"),At=null},500))}document.addEventListener("mousemove",j),document.addEventListener("mouseup",ne)}),o.addEventListener("mouseenter",()=>{Cn=!0,so(!0),ts()}),a.addEventListener("scroll",ts),o.addEventListener("mouseleave",()=>{!Nn&&!Qt&&(document.body.style.cursor=""),Cn=!1,so(!1);try{Pi()}catch{}try{Dt(!1)}catch{}}),je=qo,setTimeout(()=>{if(qo(),o&&s&&p&&a){let h=40,v=Oe();if(v.length>0)h=v[0].offsetHeight;else{let w=document.createElement("li");w.style.visibility="hidden",w.style.position="absolute",w.textContent="00:00 Example",a.appendChild(w),h=w.offsetHeight,a.removeChild(w)}B(s.offsetHeight+p.offsetHeight+h),o.style.minHeight=I()+"px"}},0),Lt){try{Lt.disconnect()}catch{}Lt=null}Lt=new ResizeObserver(qo),Lt.observe(o),Ur||document.addEventListener("pointerdown",Ur=()=>{Ia=Date.now()},!0),Gr||document.addEventListener("pointerup",Gr=()=>{},!0)}finally{yi=!1}}}async function iu(){if(!o)return;if(document.querySelectorAll("#ytls-pane").forEach(f=>{f!==o&&(d("Removing duplicate pane element from DOM"),f.remove())}),document.body.contains(o)){d("Pane already in DOM, skipping append");return}await ru(),mc(Qc),fc(eu),fa(Oo),ha(Ei),hc(Ti),uc(R),await ga(),await _c(),await En(),ya();let m=document.querySelectorAll("#ytls-pane");if(m.length>0&&(d(`WARNING: Found ${m.length} existing pane(s) in DOM, removing all`),m.forEach(f=>f.remove())),document.body.contains(o)){d("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(o),d("Pane successfully appended to DOM"),Qe(),Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{Be(),je?.(),fe(),xe(!0),Ie=null},450),Mt){try{Mt.disconnect()}catch{}Mt=null}Mt=new MutationObserver(()=>{let f=document.querySelectorAll("#ytls-pane");f.length>1&&(d(`CRITICAL: Multiple panes detected (${f.length}), removing duplicates`),f.forEach((b,T)=>{(T>0||o&&b!==o)&&b.remove()}))}),Mt.observe(document.body,{childList:!0})}function Za(l=0){if(document.getElementById("ytls-header-button")){Xt();return}let m=document.querySelector("#logo");if(!m||!m.parentElement){l<10&&setTimeout(()=>Za(l+1),300);return}let f=document.createElement("button");f.id="ytls-header-button",f.type="button",f.className="ytls-header-button",dt(f,"Toggle Timekeeper UI"),f.setAttribute("aria-label","Toggle Timekeeper UI");let b=document.createElement("img");b.src=Et,b.alt="",b.decoding="async",f.appendChild(b),pn=b,f.addEventListener("mouseenter",()=>{pn&&(wo=!0,pn.src=An)}),f.addEventListener("mouseleave",()=>{pn&&(wo=!1,Xt())}),f.addEventListener("click",()=>{o&&!document.body.contains(o)&&(d("Pane not in DOM, re-appending before toggle"),document.body.appendChild(o)),_i()}),m.insertAdjacentElement("afterend",f),Xt(),d("Timekeeper header button added next to YouTube logo")}function Wa(){if(Se())return;be(!0);let l=history.pushState,m=history.replaceState;function f(){try{let b=new Event("locationchange");window.dispatchEvent(b)}catch{}}history.pushState=function(){let b=l.apply(this,arguments);return f(),b},history.replaceState=function(){let b=m.apply(this,arguments);return f(),b},window.addEventListener("popstate",f),window.addEventListener("locationchange",()=>{window.location.href!==z&&d("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function Ai(){if(!i()){Gc();return}ue(window.location.href),document.querySelectorAll("#ytls-pane").forEach((m,f)=>{(f>0||o&&m!==o)&&m.remove()}),await Mn(),await ou(),Pe=Si();let l=document.title;d("Page Title:",l),d("Video ID:",Pe),d("Current URL:",window.location.href),xi(!0),Yr(),et(),await Ti(),et(),xi(!1),d("Timestamps loaded and UI unlocked for video:",Pe),await iu();try{Dt(!0)}catch{}Za(),Wc()}Wa(),window.addEventListener("yt-navigate-start",()=>{d("Navigation started (yt-navigate-start event fired)"),i()&&o&&a&&(d("Locking UI and showing loading state for navigation"),xi(!0))}),Vr=l=>{if(!l.repeat&&!l.ctrlKey&&!l.altKey&&!l.metaKey&&!l.shiftKey&&(l.key==="z"||l.key==="Z")){if(Dc(l.target))return;Sa()&&(l.preventDefault(),d("Playback speed toggled via keyboard shortcut (Z)"));return}l.ctrlKey&&l.altKey&&l.shiftKey&&(l.key==="T"||l.key==="t")&&(l.preventDefault(),_i(),d("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",Vr),window.addEventListener("yt-navigate-finish",()=>{d("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==z?Ai():d("Navigation finished but URL already handled, skipping.")}),Wa(),d("Timekeeper initialized and waiting for navigation events")})();})();

